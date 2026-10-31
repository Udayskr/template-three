import React from 'react';
import { Composition } from 'remotion';
import { Scene } from './Scene';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Scene"
        component={Scene}
        durationInFrames={900} // 30 Seconds @ 30fps
        fps={30}
        width={1920}           // Full HD Width
        height={1080}          // Full HD Height
      />
    </>
  );
};
