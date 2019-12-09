import Image from "Component/Image";
import Html from "Component/Html";
import React from "react";
import './MagefanBlogCard.style';
import Link from "Component/Link";

export const MagefanBlogCardComponent = ({post}) => {
    const {title, short_content, media_gallery, featured_img, publish_time, url_key, categories} = post;
    const imgUrl = featured_img || media_gallery[0] || null;
    const url = '/post/' + url_key;
    return (
        <div block="BlogCard">
            <div block="BlogCard" elem="Content">
                <div block="BlogCard" elem="Info">
                    {categories.map(item =>
                        <Link
                            to={'/' + item.url_path}
                            block="BlogCard"
                            elem="Category"
                            key={item.url_path}>
                            {item.title}
                        </Link>)}
                    <time block="BlogCard" elem="Date">{new Date(publish_time).toLocaleDateString()}</time>
                </div>
                <h3 block="BlogCard" elem="Title"><Link to={url}>{title}</Link></h3>
                <div block="BlogCard" elem="ShortText">
                    {short_content && <Html content={short_content}/>}
                </div>
                <Link to={url} block="BlogCard" elem="Image">
                    <Image alt={title} src={process.env.API_URL + '/media/' + imgUrl}/></Link>
            </div>
        </div>
    )
};