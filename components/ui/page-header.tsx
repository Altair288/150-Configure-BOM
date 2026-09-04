"use client";

import { Breadcrumbs, BreadcrumbsItem, Title } from "@ui5/webcomponents-react";
import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  breadcrumbs?: string[];
  actions?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs = [],
  actions,
}: PageHeaderProps) {
  return (
    <section className="page-header" aria-labelledby="page-title">
      <div className="page-header-copy">
        {breadcrumbs.length > 0 ? (
          <Breadcrumbs className="page-breadcrumbs">
            {breadcrumbs.map((breadcrumb) => (
              <BreadcrumbsItem key={breadcrumb}>{breadcrumb}</BreadcrumbsItem>
            ))}
          </Breadcrumbs>
        ) : null}
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <Title id="page-title" level="H1">
          {title}
        </Title>
        <p>{description}</p>
      </div>
      {actions ? <div className="page-header-actions">{actions}</div> : null}
    </section>
  );
}