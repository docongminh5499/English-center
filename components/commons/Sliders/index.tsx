import React, { useState } from 'react'
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import styles from './styles.module.css'

const defaultConfigSlider = {
    renderDesktop: 4,
    renderMobile: 2,
    spacingDesktop: 10,
    spacingMobile: 5,
    breakpoints : {
        "(max-width: 600px)": { slides: { perView: 2, spacing: 5 }},
    },
}

interface IProps {
    dataSlider?: Array<any> 
    spacingDesktop? : number,
    renderDesktop?: number,
    breakpoints? : Object,
}
const Index = (props : IProps) => {
    const {
        dataSlider = [],
        spacingDesktop,
        renderDesktop,
        breakpoints,
    } = props

    const [currentSlide, setCurrentSlide] = useState(0);
    const [sliderRef, instanceRef] = useKeenSlider({
        breakpoints: breakpoints ? {...breakpoints} : defaultConfigSlider.breakpoints as any,
        slides: { 
          perView: renderDesktop ? renderDesktop : defaultConfigSlider.renderDesktop , 
          spacing: spacingDesktop ? spacingDesktop : defaultConfigSlider.spacingDesktop
        },
        initial: 0,
        slideChanged (slider) {
            setCurrentSlide(slider.track.details.rel);
        }
    });

    return (
        dataSlider && dataSlider.length > 0 ?
        <div className="navigation-wrapper" style={{ position: 'relative' }}> 
            <div ref={sliderRef} className="keen-slider">
                {dataSlider.map((item, index) => (
                <div className="keen-slider__slide" key={index}>
                    {item}
                </div>
                ))}
            </div>

            {
                instanceRef && instanceRef.current && 
                <>
                    <Arrow
                        onClick={(e: any) => e.stopPropagation() || instanceRef.current?.prev() }
                        disabled={currentSlide === 0}
                    />

                    <Arrow
                        right
                        onClick={(e: any) => e.stopPropagation() || instanceRef.current?.next() }
                        disabled={ currentSlide === instanceRef.current.track.details.maxIdx }
                    />
                </>
            }
        </div>
        : null
    );
  };
  
  export default Index;
  
function Arrow(props : any) {
    const disabeld = props.disabled;
    return (
        !disabeld ? 
        <div
            className={`${styles.arrow} ${props.right && styles.arrow_right}`}
            hidden={disabeld}
            onClick={props.onClick}>
           <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0"
                y="0"
                enableBackground="new 0 0 400.004 400.004"
                version="1.1"
                viewBox="0 0 400.004 400.004"
                xmlSpace="preserve"
                >
                <path d="M382.688 182.686H59.116l77.209-77.214c6.764-6.76 6.764-17.726 0-24.485-6.764-6.764-17.73-6.764-24.484 0L5.073 187.757c-6.764 6.76-6.764 17.727 0 24.485l106.768 106.775a17.252 17.252 0 0012.242 5.072c4.43 0 8.861-1.689 12.242-5.072 6.764-6.76 6.764-17.726 0-24.484l-77.209-77.218h323.572c9.562 0 17.316-7.753 17.316-17.315 0-9.562-7.753-17.314-17.316-17.314z"></path>
                </svg>
        </div>
        : null
    );
}