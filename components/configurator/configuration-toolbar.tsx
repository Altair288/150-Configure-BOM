"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  Input,
  MessageStrip,
  Option,
  Select,
  Switch,
} from "@ui5/webcomponents-react";

interface ConfigurationToolbarProps {
  dirty: boolean;
  onSave: () => void;
  onReset: () => void;
}

export function ConfigurationToolbar({ dirty, onSave, onReset }: ConfigurationToolbarProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [variantName, setVariantName] = useState("Urban Motion X / Performance");
  const [liveRules, setLiveRules] = useState(true);
  const [published, setPublished] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = () => {
    onSave();
    setSaved(true);
  };

  const publish = () => {
    setPublished(true);
    setDialogOpen(false);
  };

  return (
    <div className="configuration-toolbar">
      <div className="configuration-toolbar-row" role="toolbar" aria-label="Configuration actions">
        <span className="toolbar-label">Revision</span>
        <Select accessibleName="BOM revision" value="A.04">
          <Option value="A.04">A.04 · Released</Option>
          <Option value="A.03">A.03 · Archived</Option>
        </Select>
        <span className="toolbar-separator" aria-hidden="true" />
        <Switch
          checked={liveRules}
          textOn="On"
          textOff="Off"
          accessibleName="Live configuration rules"
          onChange={(event) => setLiveRules(event.currentTarget?.checked ?? false)}
        />
        <span className="toolbar-label">Live rules</span>
        <span className="toolbar-separator" aria-hidden="true" />
        <Button icon="refresh" tooltip="Reset selections" accessibleName="Reset selections" onClick={onReset} />
        <Button
          icon="save"
          design={dirty ? "Emphasized" : "Default"}
          tooltip="Save variant"
          accessibleName="Save variant"
          data-testid="save-configuration"
          onClick={save}
        >
          {saved ? "Saved" : "Save"}
        </Button>
        <Button
          icon="activate"
          design="Positive"
          tooltip="Publish variant"
          accessibleName="Publish variant"
          data-testid="publish-configuration"
          onClick={() => setDialogOpen(true)}
        >
          {published ? "Published" : "Publish"}
        </Button>
      </div>
      {dirty ? <span className="toolbar-dirty-indicator">Unsaved changes</span> : null}
      <Dialog
        open={dialogOpen}
        headerText="Publish configuration variant"
        accessibleName="Publish configuration variant"
        onClose={() => setDialogOpen(false)}
      >
        <div className="dialog-content">
          <MessageStrip design="Information">Publishing creates a released variant from the current selections.</MessageStrip>
          <label htmlFor="variant-name">Variant name</label>
          <Input
            id="variant-name"
            value={variantName}
            placeholder="Enter a variant name"
            onInput={(event) => setVariantName(event.currentTarget?.value ?? "")}
          />
        </div>
        <div slot="footer" className="dialog-actions">
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button design="Emphasized" disabled={!variantName.trim()} onClick={publish}>
            Publish variant
          </Button>
        </div>
      </Dialog>
    </div>
  );
}