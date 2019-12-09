import StoreSwitcher from "Component/StoreSwitcher";
import Image from "Component/Image/Image.container";
import React from "react";
import Html from "Component/Html";
import Meta from "Component/Meta";
import './MagefanBlogPost.style';
import ContentWrapper from "Component/ContentWrapper";
import Link from "Component/Link";

const MagefanBlogPostComponent = (props) => {
    const {post, history} = props;
    const {title, content, media_gallery, related_posts} = post;
    return (
        <main block="BlogPost">
            <ContentWrapper
                wrapperMix={{block: 'BlogPost', elem: 'Wrapper'}}
                label="Blog post"
            >
                <Meta metaObject={post}/>
                <span block="BlogPost" elem="MainTitle">{__('Blog')}</span>
                <h1>{title}</h1>
                <div block="LanguageChanger" elem="Buttons"><StoreSwitcher/></div>
                {(media_gallery || []).map(image =>
                    <Image alt={title}
                           key={image}
                           src={process.env.API_URL + '/media/' + image}/>
                )}
                <div block="BlogPost" elem="Content">
                    {content && <Html content={content}/>}
                    <button onClick={() => {history.goBack()}} className="button-prev">{__('Back to list')}</button>
                </div>
                <div block="BlogPost" elem="Articles">
                    <h2>{__('More articles')}</h2>
                    <ul>
                        {(related_posts || []).map(postLink =>
                            <li>
                                <Link to={'/post/' + postLink.url_key}>{postLink.title}</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </ContentWrapper>
        </main>
    )
};

export default MagefanBlogPostComponent;