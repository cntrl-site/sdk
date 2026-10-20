export class Writer {
  private data: Uint8Array;
  private idx: number;
  private size: number;

  constructor(size: number) {
    this.data = new Uint8Array(size);
    this.idx = 0;
    this.size = size;
  }

  getData() {
    if (this.idx !== this.size) throw new Error('Mismatch between size reserved and sized used');
    return this.data.slice(0, this.idx);
  }

  writeUint8(value: number) {
    this.data.set([value], this.idx);
    this.idx += 1;
  }

  writeUint16(value: number) {
    const arr = new Uint16Array(1);
    arr[0] = value;
    const buffer = new Uint8Array(arr.buffer);
    this.data.set([buffer[1], buffer[0]], this.idx);
    this.idx += 2;
  }

  writeUint8Array(value: Uint8Array) {
    this.data.set(value, this.idx);
    this.idx += value.length;
  }
}

interface AVCCBox {
  configurationVersion: number;
  AVCProfileIndication: number;
  profile_compatibility: number;
  AVCLevelIndication: number;
  lengthSizeMinusOne: number;
  nb_SPS_nalus: number;
  SPS: { length: number; nalu: Uint8Array }[];
  nb_PPS_nalus: number;
  PPS: { length: number; nalu: Uint8Array }[];
}

const getExtradata = (avccBox: AVCCBox) => {
  let i;
  let size = 7;
  for (i = 0; i < avccBox.SPS.length; i += 1) {
    // nalu length is encoded as a uint16.
    size += 2 + avccBox.SPS[i].length;
  }
  for (i = 0; i < avccBox.PPS.length; i += 1) {
    // nalu length is encoded as a uint16.
    size += 2 + avccBox.PPS[i].length;
  }
  const writer = new Writer(size);
  writer.writeUint8(avccBox.configurationVersion);
  writer.writeUint8(avccBox.AVCProfileIndication);
  writer.writeUint8(avccBox.profile_compatibility);
  writer.writeUint8(avccBox.AVCLevelIndication);
  writer.writeUint8(avccBox.lengthSizeMinusOne + (63 << 2));
  writer.writeUint8(avccBox.nb_SPS_nalus + (7 << 5));
  for (i = 0; i < avccBox.SPS.length; i += 1) {
    writer.writeUint16(avccBox.SPS[i].length);
    writer.writeUint8Array(avccBox.SPS[i].nalu);
  }
  writer.writeUint8(avccBox.nb_PPS_nalus);
  for (i = 0; i < avccBox.PPS.length; i += 1) {
    writer.writeUint16(avccBox.PPS[i].length);
    writer.writeUint8Array(avccBox.PPS[i].nalu);
  }
  return writer.getData();
};

const decodeVideo = async (
  src: string,
  emitFrame: (bitmap: ImageBitmap) => void,
  { VideoDecoder, EncodedVideoChunk, debug }: any
): Promise<void> => {
  if (debug) console.info('Decoding video from', src);
  const controller = new AbortController();
  const body = fetch(src, { signal: controller.signal }).then((res) => {
    if (!res.ok || !res.body) throw new Error(`Failed to fetch ${src}: HTTP ${res.status}`);
    return res.body;
  });
  body.catch(() => undefined);
  const MP4Box = await import('mp4box').catch((error) => {
    controller.abort();
    throw error;
  });

  return new Promise((resolve, reject) => {
    const bitmaps: Promise<void>[] = [];
    let decoder: any;
    let configured = false;
    let settled = false;

    const fail = (error: unknown) => {
      if (settled) return;
      settled = true;
      controller.abort();
      if (decoder && decoder.state !== 'closed') decoder.close();
      reject(error);
    };

    const finish = async () => {
      if (!configured) throw new Error('URL provided is not a valid mp4 video file.');
      await decoder.flush();
      await Promise.all(bitmaps);
      if (settled) return;
      settled = true;
      decoder.close();
      resolve();
    };

    try {
      decoder = new VideoDecoder({
        output: (frame: VideoFrame) => {
          bitmaps.push(
            createImageBitmap(frame, { resizeQuality: 'low' })
              .then((bitmap) => {
                if (settled) bitmap.close();
                else emitFrame(bitmap);
              })
              .catch(fail)
              .finally(() => frame.close())
          );
        },
        error: (error: unknown) => {
          console.error(error);
          fail(error);
        },
      });

      const mp4boxfile = MP4Box.createFile();
      mp4boxfile.onError = fail;

      mp4boxfile.onReady = (info: any) => {
        try {
          const track = info?.videoTracks?.[0];
          if (!track) throw new Error('URL provided is not a valid mp4 video file.');
          if (debug) console.info('Video with codec:', track.codec);
          const avccBox = mp4boxfile.getTrackById(track.id)?.mdia.minf.stbl.stsd.entries[0]?.avcC;
          if (!avccBox) throw new Error(`Unsupported codec ${track.codec}: only H.264 video can be decoded.`);
          decoder.configure({ codec: track.codec, description: getExtradata(avccBox) });
          configured = true;
          mp4boxfile.setExtractionOptions(track.id);
          mp4boxfile.start();
        } catch (error) {
          fail(error);
        }
      };

      mp4boxfile.onSamples = (_trackId: number, _ref: unknown, samples: any[]) => {
        try {
          for (const sample of samples) {
            decoder.decode(new EncodedVideoChunk({
              type: sample.is_sync ? 'key' : 'delta',
              timestamp: sample.cts,
              duration: sample.duration,
              data: sample.data,
            }));
          }
        } catch (error) {
          fail(error);
        }
      };

      body
        .then(async (stream) => {
          const reader = stream.getReader();
          let offset = 0;
          for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read()) {
            if (settled) return;
            const buffer = chunk.value.buffer as ArrayBuffer & { fileStart: number };
            buffer.fileStart = offset;
            offset += buffer.byteLength;
            mp4boxfile.appendBuffer(buffer);
          }
          mp4boxfile.flush();
          await finish();
        })
        .catch(fail);
    } catch (error) {
      fail(error);
    }
  });
};


export default ( src: string, emitFrame: (bitmap: ImageBitmap) => void, debug: boolean): Promise<void> => {
  if (typeof VideoDecoder === 'function' && typeof EncodedVideoChunk === 'function') {
    if (debug)
      console.info('WebCodecs is natively supported, using native version...');
    return decodeVideo(src, emitFrame, {
      VideoDecoder,
      EncodedVideoChunk,
      debug,
    });
  }
  if (debug) console.info('WebCodecs is not available in this browser.');
  return Promise.resolve();
};
