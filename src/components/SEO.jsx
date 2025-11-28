// src/components/SEO.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, name, type, url }) => {
  const siteTitle = "TGT Explorer - HPRCA Non-Medical Exam Prep";
  const defaultDescription = "Prepare for TGT Non-Medical commission with free quizzes, study notes, physics formulas, and mathematics syllabus coverage tailored for HPRCA.";
  const defaultKeywords = "TGT Non Medical, HPRCA, Physics, Mathematics, Chemistry, Competitive Exam, Himachal Pradesh TGT, Calculus Formulas";

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title ? `${title} | TGT Explorer` : siteTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      
      {/* Facebook / Open Graph */}
      <meta property="og:type" content={type || 'website'} />
      <meta property="og:title" content={title ? `${title} | TGT Explorer` : siteTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:url" content={url || window.location.href} />
      <meta property="og:site_name" content="TGT Explorer" />
      
      {/* Twitter Cards */}
      <meta name="twitter:creator" content={name || "@cmlowerence"} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title ? `${title} | TGT Explorer` : siteTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
    </Helmet>
  );
};

export default SEO;
