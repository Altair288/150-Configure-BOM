"use client";

import { Button, Toolbar } from "@ui5/webcomponents-react";

export function RuleActions() {
  return (
    <Toolbar className="rules-toolbar" accessibleName="Rule actions" waitForDefine>
      <Button icon="add" design="Emphasized" waitForDefine>Create rule</Button>
      <Button icon="download" waitForDefine>Export rule set</Button>
    </Toolbar>
  );
}