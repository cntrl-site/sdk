import React, { useState, useEffect, FC } from 'react';

interface SvgImageProps {
  url: string;
  fill?: string;
  hoverFill?: string;
  className?: string;
}

export const SvgImage: FC<SvgImageProps> = ({ url, fill = '#000', hoverFill = '#f00', className = '' }) => {
  const [svgContent, setSvgContent] = useState<TrustedHTML | null>(null);
  useEffect(() => {
    const fetchSvg = async () => {
      try {
        if (url.endsWith('.svg')) {
          const response = await fetch(url);
          let text = await response.text();
          const styleTag = `
            <style>
              .dynamic-fill {
                fill: ${fill};
                transition: fill 0.3s ease;
              }
              .dynamic-fill:hover {
                fill: ${hoverFill};
              }
            </style>
          `;
          text = text.replace(
            /<svg([^>]*)>/,
            `<svg$1 class="dynamic-fill">${styleTag}`
          );
          text = text.replace(/fill=".*?"/g, '');
          setSvgContent(text);
        }
      } catch (error) {
        console.error('Error fetching SVG:', error);
      }
    };
    fetchSvg();
  }, [url, fill, hoverFill]);

  if (!url.endsWith('.svg') || !svgContent) {
    return <img src={url} alt="" className={className} />;
  }

  return (
    <span
      className={`svg-container ${className}`}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};
