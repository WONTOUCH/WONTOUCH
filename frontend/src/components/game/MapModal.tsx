import React, { useCallback, useEffect } from 'react';
import map from '../../assets/map/map_origin.png';
import { debounce } from 'lodash';
import { MapProps } from './types';

const MapModal: React.FC<MapProps> = ({ closeMapModal }) => {
  const handleKeyDown = useCallback(
    debounce((event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'M' || event.key === 'm') {
        closeMapModal();
      }
    }, 300),
    [closeMapModal],
  );

  useEffect(() => {
    // 이벤트 등록
    window.addEventListener('keydown', handleKeyDown);

    // 모달 닫히면 이벤트 제거
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      {/* 모달 뒤에 어두운 배경 */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-1000"></div>
      <div className="fixed inset-0 flex justify-center z-50">
        <div
          className="p-6"
          style={{
            width: Math.min(window.innerWidth * 0.8, 1100), // 윈도우 크기에 비례해서 맵 크기 설정
            height: Math.min(window.innerHeight * 0.8, 600), // 높이 비례 설정
          }}
        >
          <div className="flex-col">
            <div className="text-white text-center text-3xl p-6 text-stroke">
              WON TOUCH! <span className="text-[#FFEE00] text-stroke">Map</span>
            </div>
            <img
              src={map}
              alt="맵이당"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MapModal;
