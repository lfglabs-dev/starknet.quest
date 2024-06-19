import React from "react";

interface TabProps {
  title: string;
  names: string;
  prep: number;
  setActive: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  mouseLeave: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export const SlidingTab: React.FC<TabProps> = ({
  title,
  names,
  setActive,
  prep,
  mouseLeave
}) => {
  return (
    <div
      className={`${names} rounded-lg z-50 nav-tab`}
      onClick={setActive}
      key={prep}
      onMouseLeave={mouseLeave}
    >
      {title}
    </div>
  );
};


export const moveHrSlider = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, element: string): void => {
  const parentWrapper = document.querySelector<HTMLDivElement>(element);
  if (parentWrapper) {
    const hrSlider = parentWrapper.querySelector<HTMLHRElement>('hr');
    const target = event.currentTarget as HTMLDivElement;
    if (hrSlider && target) {
      const targetRect = target.getBoundingClientRect();
      const parentRect = parentWrapper.getBoundingClientRect();
      hrSlider.style.marginLeft = `${targetRect.left - parentRect.left}px`;
      hrSlider.style.opacity = "1";
      hrSlider.style.width = `${targetRect.width}px`;
    }
  }
};

export const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, element: string): void => {
  const parentWrapper = document.querySelector<HTMLDivElement>(element);
  if (parentWrapper) {
      const hrSlider = parentWrapper.querySelector<HTMLHRElement>('hr');
      const currentTab = parentWrapper.querySelector<HTMLDivElement>('.active');
      if (hrSlider && currentTab) {
        const currentTabRect = currentTab.getBoundingClientRect();
        hrSlider.style.marginLeft = `${currentTabRect.left - parentWrapper.getBoundingClientRect().left}px`;
        hrSlider.style.opacity = '0';
      }
    }
};

export const moveSpanActive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, element: string): void => {
  const parentWrapper = document.querySelector<HTMLDivElement>(element);
  if (parentWrapper) {
    const spanActive = parentWrapper.querySelector<HTMLSpanElement>('span');
    const target = event.currentTarget as HTMLDivElement;
    if (spanActive && target) {
      const targetRect = target.getBoundingClientRect();
      const parentRect = parentWrapper.getBoundingClientRect();
      spanActive.style.marginLeft = `${targetRect.left - parentRect.left}px`;
      spanActive.style.width = `${targetRect.width}px`;
      spanActive.style.opacity = "1";
    }
  }
};