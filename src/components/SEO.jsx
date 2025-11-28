import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEO = ({ title, description, keywords, type }) => {
  const location = useLocation();
  const siteUrl = "https://learn-next-level.vercel.app";
  const fullUrl = `${siteUrl}${location.pathname}`;

  const siteTitle = "TGT Explorer - HPRCA Non-Medical Exam Prep";
  const defaultDescription = "Free TGT Non-Medical commission preparation with AI-powered quizzes, physics formulas, chemistry notes, and mathematics syllabus coverage tailored for HPRCA.";
  const defaultKeywords = "TGT Non Medical, HPRCA, Physics, Mathematics, Chemistry, Competitive Exam, Himachal Pradesh TGT, Calculus Formulas, AI Quiz";

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title ? `${title} | TGT Explorer` : siteTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type || 'website'} />
      <meta property="og:title" content={title ? `${title} | TGT Explorer` : siteTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="TGT Explorer" />
      {/* Add an OG Image here later if you have one, e.g., /og-image.png in public folder */}
      {/* <meta property="og:image" content={`${siteUrl}/og-image.png`} /> */}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@cmlowerence" />
      <meta name="twitter:title" content={title ? `${title} | TGT Explorer` : siteTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
    </Helmet>
  );
};

export default SEO;
