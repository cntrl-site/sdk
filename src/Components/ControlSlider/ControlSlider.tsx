import React, { useState, useEffect } from 'react';
import styles from './ControlSlider.module.scss';
import { Splide, SplideSlide, SplideProps } from '@splidejs/react-splide';
import '@splidejs/react-splide/css/core';
import cn from 'classnames';
import { RichTextRenderer } from '../helpers/RichTextRenderer/RichTextRenderer';
import { scalingValue } from '../utils/scalingValue';
import { SvgImage } from '../helpers/SvgImage/SvgImage';

interface SliderProps {
  settings: SliderSettings;
  content: SliderItem[];
  styles: SliderStyles;
  isEditor?: boolean;
}

const alignmentClassName: Record<Alignment, string> = {
  'top-left': styles.topLeftAlignment,
  'top-center': styles.topCenterAlignment,
  'top-right': styles.topRightAlignment,
  'middle-left': styles.middleLeftAlignment,
  'middle-center': styles.middleCenterAlignment,
  'middle-right': styles.middleRightAlignment,
  'bottom-left': styles.bottomLeftAlignment,
  'bottom-center': styles.bottomCenterAlignment,
  'bottom-right': styles.bottomRightAlignment,
};

export function ControlSlider({ settings, content, styles: sliderStyles, isEditor }: SliderProps) {
  const [sliderRef, setSliderRef] = useState<Splide | null>(null);
  const { widthSettings, fontSettings, letterSpacing, textAlign, wordSpacing, fontSizeLineHeight, textAppearance, color } = sliderStyles.caption;
  const [sliderDimensions, setSliderDimensions] = useState<Dimensions | undefined>(undefined);
  const [wrapperRef, setWrapperRef] = useState<HTMLDivElement | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { direction } = settings;
  const { x: controlsOffsetX, y: controlsOffsetY } = settings.controls.offset;
  const handleArrowClick = (dir: '+1' | '-1') => {
    if (sliderRef) {
      sliderRef.go(dir);
    }
  };
  useEffect(() => {
    if (!wrapperRef) return;
    const observer = new ResizeObserver((entries) => {
      if (!sliderRef) return;
      const [wrapper] = entries;
      setSliderDimensions({
        width: Math.round(wrapper.contentRect.width),
        height: Math.round(wrapper.contentRect.height)
      });
    });
    observer.observe(wrapperRef);
    return () => observer.unobserve(wrapperRef);
  }, [wrapperRef]);

  return (
    <div className={cn(styles.wrapper, { [styles.editor]: isEditor })} ref={setWrapperRef}>
      {settings.caption.isActive && (
        <div
          className={cn(styles.captionBlock)}
        >
          <div
            className={styles.captionTextWrapper}
          >
            {content.map((item, index) => (
              <div
                key={index}
                className={cn(styles.captionText, alignmentClassName[settings.caption.alignment], { 
                  [styles.withPointerEvents]: index === currentSlideIndex && isEditor
                })}
                style={{
                  fontFamily: fontSettings.fontFamily,
                  fontWeight: fontSettings.fontWeight,
                  fontStyle: fontSettings.fontStyle,
                  width: widthSettings.sizing === 'auto' ? 'max-content' : scalingValue(widthSettings.width, isEditor),
                  letterSpacing: scalingValue(letterSpacing, isEditor),
                  wordSpacing: scalingValue(wordSpacing, isEditor),
                  textAlign,
                  fontSize: scalingValue(fontSizeLineHeight.fontSize, isEditor),
                  lineHeight: scalingValue(fontSizeLineHeight.lineHeight, isEditor),
                  textTransform: textAppearance.textTransform ?? 'none',
                  textDecoration: textAppearance.textDecoration ?? 'none',
                  fontVariant: textAppearance.fontVariant ?? 'normal',
                  color,
                  opacity: index === currentSlideIndex ? 1 : 0,
                }}
              >
                <div
                  data-styles="caption"
                  className={styles.captionTextInner}
                  style={{
                    '--link-hover-color': settings.caption.hover,
                    position: 'relative',
                    top: scalingValue(settings.caption.offset.y, isEditor),
                    left: scalingValue(settings.caption.offset.x, isEditor)
                  } as React.CSSProperties}
                >
                  <RichTextRenderer content={item.imageCaption} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Splide
        onMove={(e) => {
          setCurrentSlideIndex(e.index);
        }}
        ref={setSliderRef}
        options={{
          arrows: false,
          speed: 600,
          autoplay: isEditor ? false : settings.triggers.autoPlay !== null,
          ...(settings.triggers.autoPlay !== null && {
            interval: parseInt(settings.triggers.autoPlay) * 1000,
          }),
          direction: direction === 'horizontal' ? 'ltr' : 'ttb',
          pagination: false,
          drag: settings.triggers.triggersList.drag,
          perPage: 1,
          width: sliderDimensions ? sliderDimensions?.width : '100%',
          height: sliderDimensions ? sliderDimensions?.height : '100%',
          type: 'loop'
        }}
      >
        {content.map((item, index) => (
          <SplideSlide key={index}>
            <div
              className={styles.sliderItem}
              style={{
                ...sliderDimensions
              }}
            >
              <div
                className={styles.imgWrapper}
              >
                <img
                  className={cn(styles.sliderImage, {
                    [styles.contain]: item.image.objectFit === 'contain',
                    [styles.cover]: item.image.objectFit === 'cover'
                  })}
                  src={item.image.url} alt={item.image.name ?? ''}
                />
              </div>
            </div>
          </SplideSlide>
        ))}
      </Splide>
      {settings.controls.isActive && (
        <>
          <div
            className={cn(styles.arrow, {
              [styles.arrowVertical]: settings.direction === 'vertical'
            })}
            style={{
              color: settings.controls.color,
              ['--arrow-hover-color' as string]: settings.controls.hover
            }}
          >
            <button
              onClick={() => {
                handleArrowClick('-1');
              }}
              className={styles.arrowInner}
              style={{
                transform: `translate(${scalingValue(controlsOffsetX, isEditor)}, ${scalingValue(controlsOffsetY * (direction === 'horizontal' ? 1 : -1), isEditor)}) scale(${settings.controls.scale / 100}) rotate(${direction === 'horizontal' ? '0deg' : '90deg'})`,
              }}
            >
              {settings.controls.arrowsImgUrl && (
                <SvgImage
                  url={settings.controls.arrowsImgUrl}
                  fill={settings.controls.color}
                  hoverFill={settings.controls.hover}
                  className={cn(styles.arrowImg, styles.mirror)}
                />
              )}
              {!settings.controls.arrowsImgUrl && (
                <ArrowIcon color={settings.controls.color} className={cn(styles.arrowIcon, styles.arrowImg, styles.mirror)} />
              )}
            </button>
          </div>
          <div
            className={cn(styles.arrow, styles.nextArrow, {
              [styles.arrowVertical]: settings.direction === 'vertical'
            })}
            style={{
              color: settings.controls.color,
              ['--arrow-hover-color' as string]: settings.controls.hover
            }}
          >
            <button
              className={styles.arrowInner}
              onClick={() => handleArrowClick('+1')}
              style={{
                transform: `translate(${scalingValue(controlsOffsetX * (direction === 'horizontal' ? -1 : 1), isEditor)}, ${scalingValue(controlsOffsetY, isEditor)}) scale(${settings.controls.scale / 100}) rotate(${direction === 'horizontal' ? '0deg' : '90deg'})`,
              }}
            >
              {settings.controls.arrowsImgUrl && (
                <SvgImage
                  url={settings.controls.arrowsImgUrl}
                  fill={settings.controls.color}
                  hoverFill={settings.controls.hover}
                  className={styles.arrowImg}
                />
              )}
              {!settings.controls.arrowsImgUrl && (
                <ArrowIcon color={settings.controls.color} className={cn(styles.arrowIcon, styles.arrowImg)} />
              )}
            </button>
          </div>
        </>
      )}
      {settings.triggers.triggersList.click && (
        <div
          className={styles.clickOverlay}
          onClick={() => {
            if (sliderRef) {
              sliderRef.go('+1');
            }
          }}
        />
      )}
      {settings.pagination.isActive && (
        <div
          className={cn(styles.pagination, {
            [styles.paginationInsideBottom]: settings.pagination.position === 'inside-1' && settings.direction === 'horizontal',
            [styles.paginationInsideTop]: settings.pagination.position === 'inside-2' && settings.direction === 'horizontal',
            [styles.paginationOutsideBottom]: settings.pagination.position === 'outside-1' && settings.direction === 'horizontal',
            [styles.paginationOutsideTop]: settings.pagination.position === 'outside-2' && settings.direction === 'horizontal',
            [styles.paginationInsideLeft]: settings.pagination.position === 'inside-1' && settings.direction === 'vertical',
            [styles.paginationInsideRight]: settings.pagination.position === 'inside-2' && settings.direction === 'vertical',
            [styles.paginationOutsideLeft]: settings.pagination.position === 'outside-1' && settings.direction === 'vertical',
            [styles.paginationOutsideRight]: settings.pagination.position === 'outside-2' && settings.direction === 'vertical',
            [styles.paginationVertical]: settings.direction === 'vertical',
          })}
        >
          <div
            className={styles.paginationInner}
            style={{
              backgroundColor: settings.pagination.colors[2],
              transform: `scale(${settings.pagination.scale / 100}) translate(${scalingValue(settings.pagination.offset.x, isEditor)}, ${scalingValue(settings.pagination.offset.y, isEditor)}) rotate(${settings.direction === 'horizontal' ? '0deg' : '90deg'})`,
            }}
          >
            {content.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (sliderRef) {
                    sliderRef.go(index);
                  }
                }}
                className={cn(styles.paginationItem)}
              >
                <div
                  className={cn(styles.dot, {
                    [styles.activeDot]: index === currentSlideIndex
                  })}
                  style={{
                    backgroundColor: index === currentSlideIndex ? settings.pagination.colors[0] : settings.pagination.colors[1],
                    ['--pagination-hover-color' as string]: settings.pagination.hover
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ArrowIcon({ color, className }: { color: string, className: string }) {
  return (
    <svg viewBox="0 0 10 18" className={className}>
      <g id="Symbols" stroke="none" strokeWidth="1" fillRule="evenodd">
          <path d="M-3.70710678,4.29289322 C-3.34662282,3.93240926 -2.77939176,3.90467972 -2.38710056,4.20970461 L-2.29289322,4.29289322 L5,11.585 L12.2928932,4.29289322 C12.6533772,3.93240926 13.2206082,3.90467972 13.6128994,4.20970461 L13.7071068,4.29289322 C14.0675907,4.65337718 14.0953203,5.22060824 13.7902954,5.61289944 L13.7071068,5.70710678 L5.70710678,13.7071068 C5.34662282,14.0675907 4.77939176,14.0953203 4.38710056,13.7902954 L4.29289322,13.7071068 L-3.70710678,5.70710678 C-4.09763107,5.31658249 -4.09763107,4.68341751 -3.70710678,4.29289322 Z" id="Shape-Copy" fill={color} transform="translate(5, 9) rotate(-90) translate(-5, -9)"></path>
      </g>
    </svg>
  );
}

type SliderItem = {
  image: {
    url: string;
    name?: string;
    objectFit?: 'cover' | 'contain';
  };
  imageCaption: any[];
};

type Offset = {
  x: number;
  y: number;
}

type SliderControls = {
  arrowsImgUrl: string | null;
  isActive: boolean;
  color: string;
  hover: string;
  offset: Offset;
  scale: number;
};

type SliderPagination = {
  position: 'outside-1' | 'outside-2' | 'inside-1' | 'inside-2';
  isActive: boolean;
  scale: number;
  offset: Offset;
  colors: string[];
  hover: string;
};

type Alignment = 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

type SliderCaption = {
  alignment: Alignment;
  isActive: boolean;
  color: string;
  offset: Offset;
  hover: string;
};

type Triggers = {
  triggersList: {
    click: boolean;
    drag: boolean;
  };
  autoPlay: string | null;
};

type SliderSettings = {
  controls: SliderControls;
  pagination: SliderPagination;
  direction: 'horizontal' | 'vertical';
  caption: SliderCaption;
  triggers: Triggers;
};

type CaptionStyles = {
  fontSettings: {
    fontFamily: string;
    fontWeight: number;
    fontStyle: string;
  },
  widthSettings: {
    width: number;
    sizing: 'auto' | 'manual';
  };
  letterSpacing: number;
  textAlign: 'left' | 'center' | 'right';
  wordSpacing: number;
  fontSizeLineHeight: {
    fontSize: number;
    lineHeight: number;
  };
  textAppearance: {
    textTransform: 'none' | 'uppercase' | 'lowercase';
    textDecoration: 'none' | 'underline';
    fontVariant: 'normal' | 'small-caps';
  };
  color: string;
};

type SliderStyles = {
  caption: CaptionStyles;
}

type Dimensions = {
  width: number;
  height: number;
}
