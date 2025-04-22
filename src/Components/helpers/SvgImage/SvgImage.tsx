import React, { useState, useEffect, FC } from 'react';
import cn from 'classnames';
import styles from './SvgImage.module.scss';

interface SvgImageProps {
  url: string;
  fill?: string;
  hoverFill?: string;
  className?: string;
}

export const SvgImage: FC<SvgImageProps> = ({ url, fill = '#000000', hoverFill = '#CCCCCC', className = '' }) => {
  if (!url.endsWith('.svg')) {
    return <img src={url} alt="" className={cn(styles.img, className)} />;
  }

  return (
    <span
      className={cn(styles.svg, className)}
      style={{
        '--svg': `url(${url})`,
        '--fill': fill,
        '--hover-fill': hoverFill,
      } as React.CSSProperties}
    />
  );
};
