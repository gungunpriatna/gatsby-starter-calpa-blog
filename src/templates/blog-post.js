/* eslint-disable react/destructuring-assignment */
/* eslint react/prop-types: 0 */

// Components
import React, { Component } from 'react';
import { graphql } from 'gatsby';

import 'gitalk/dist/gitalk.css';

import { parseChineseDate } from '../api';
import { parseImgur } from '../api/images';

import ExternalLink from '../components/ExternalLink';
import Sidebar from '../components/Sidebar';
import Content from '../components/Content';
import SEO from '../components/SEO';

import Header from '../components/Header';

import ShareBox from '../components/ShareBox';

import { config } from '../../data';

// Styles
import './blog-post.scss';

const { name, iconUrl, gitalk } = config;

const bgWhite = { padding: '10px 15px', background: 'white' };

// Prevent webpack window problem
const isBrowser = typeof window !== 'undefined';
const Gitalk = isBrowser ? require('gitalk') : undefined;

// Parse url
const getURL = node => node.frontmatter.slug || node.fields.slug;

class BlogPost extends Component {
  constructor(props) {
    super(props);
    this.data = this.props.data;
  }

  componentDidMount() {
    const { frontmatter } = this.data.content.edges[0].node;
    const { title, id } = frontmatter;

    const GitTalkInstance = new Gitalk({
      ...gitalk,
      title,
      id,
    });
    GitTalkInstance.render('gitalk-container');
  }

  render() {
    const { previous, node, next } = this.data.content.edges[0];

    const { html, frontmatter, fields } = node;

    const { slug } = fields;

    const {
      title, id, date, image,
    } = frontmatter;

    const { totalCount, edges } = this.data.latestPosts;

    return (
      <div className="row post order-2">
        <Header
          img={parseImgur(image)}
          title={title}
          authorName={name}
          authorImage={iconUrl}
          subTitle={parseChineseDate(date)}
        />
        <Sidebar totalCount={totalCount} posts={edges} post />
        <div className="col-lg-8 col-md-12 col-sm-12 order-10 content">
          <Content post={html} uuid={id} title={title} />

          <div className="m-message" style={bgWhite}>
            如果你覺得我的文章對你有幫助的話，希望可以推薦和交流一下。歡迎
            <ExternalLink
              href="https://github.com/calpa/gatsby-starter-calpa-blog"
              title="關注和 Star 本博客"
            />
            或者
            <ExternalLink
              href="https://github.com/calpa/"
              title="關注我的 Github"
            />
            。
          </div>

          <div className="m-change-page" style={bgWhite}>
            <p>更多文章：</p>
            {previous && (
              <p>
                <a href={getURL(previous)}>{previous.frontmatter.title}</a>
              </p>
            )}
            {next && (
              <p>
                <a href={getURL(next)}>{next.frontmatter.title}</a>
              </p>
            )}
          </div>
        </div>

        <ShareBox url={slug} />
        <div id="gitalk-container" className="col-sm-8 col-12 order-12" />
        <SEO
          title={title}
          url={slug}
          siteTitleAlt="Calpa's Blog"
          isPost={false}
        />
      </div>
    );
  }
}

export const pageQuery = graphql`
  fragment post on MarkdownRemark {
    fields {
      slug
    }
    frontmatter {
      id
      title
      slug
      date
    }
  }

  query BlogPostQuery($index: Int) {
    content: allMarkdownRemark(
      sort: { order: DESC, fields: frontmatter___date }
      skip: $index
      limit: 1
    ) {
      edges {
        node {
          html
          ...post
        }

        previous {
          ...post
        }

        next {
          ...post
        }
      }
    }

    latestPosts: allMarkdownRemark(
      sort: { order: DESC, fields: frontmatter___date }
      limit: 6
    ) {
      totalCount
      edges {
        node {
          ...post
        }
      }
    }
  }
`;

export default BlogPost;
