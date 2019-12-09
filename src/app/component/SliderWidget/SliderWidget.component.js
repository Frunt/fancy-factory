/* eslint-disable react/no-array-index-key */
/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import PropTypes from 'prop-types';
import {PureComponent} from 'react';
import Slider from 'react-slick';
import Image from 'Component/Image';
import Html from 'Component/Html';
import './SliderWidget.style';
import Link from "Component/Link";

/**
 * Homepage slider
 * @class SliderWidget
 */
export default class SliderWidget extends PureComponent {
  static propTypes = {
    slider: PropTypes.shape({
      slides: PropTypes.arrayOf(
        PropTypes.shape({
          image: PropTypes.string,
          slide_text: PropTypes.string,
          isPlaceholder: PropTypes.bool
        })
      )
    })
  };

  renderSlide = this.renderSlide.bind(this);


  renderSlide(slide, i) {
    const {
      image,
      image_2,
      slide_text,
      isPlaceholder,
      slide_link: link,
      title: block
    } = slide;
    return (
      <figure
        block="SliderWidget"
        elem="Figure"
        key={i}
      >
        <Image
          mix={{block: 'SliderWidget', elem: 'FigureImage', mods: {type: 'bg'}}}
          ratio="custom"
          src={'/' + image}
          isPlaceholder={isPlaceholder}
        />
        {image_2 && <Image
          mix={{block: 'SliderWidget', elem: 'FigureImage', mods: {type: 'prod'}}}
          ratio="custom"
          src={'/pub/media/' + image_2}
          isPlaceholder={isPlaceholder}
        />}
        <figcaption
          block="SliderWidget"
          elem="Figcaption"
          mix={{block}}
        >
          <h2>{block}</h2>
          <Html content={slide_text || ''}/>
          {link && <Link
            to={link}
            block={"SliderWidget"}
            elem={"Button"}
          >{__('Buy now')}</Link>}
        </figcaption>
      </figure>
    );
  }

  render() {
    const {slider, showTitle} = this.props;
    if (!slider) return null;
    const {
      show_menu,
      slides_to_display,
      slides_to_display_tablet,
      slides_to_display_mobile,
      slides_to_scroll,
      slides_to_scroll_tablet,
      slides_to_scroll_mobile,
      slide_speed,
      show_navigation,
      title,
      slides
    } = slider;
    const settings = {
      dots: show_menu,
      arrows: show_navigation,
      infinite: true,
      lazyLoad: 'ondemand',
      speed: slide_speed || 300,
      slidesToShow: slides_to_display || 1,
      slidesToScroll: slides_to_scroll || 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: slides_to_display_tablet || 1,
            slidesToScroll: slides_to_scroll_tablet || 1,
          }
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: slides_to_display_mobile || 1,
            slidesToScroll: slides_to_scroll_mobile || 1,
          }
        }
      ]
    };
    return (
      <div block={'SliderWidget'}>
        {(showTitle && title) && <h4 className='section-title'>{title}</h4>}
        <Slider
          {...settings}
        >
          {(slides || []).map(this.renderSlide)}
        </Slider>
      </div>
    );
  }

}
