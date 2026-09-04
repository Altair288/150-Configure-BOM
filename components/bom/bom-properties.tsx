"use client";

import {
  Form,
  FormGroup,
  FormItem,
  Label,
  ObjectStatus,
  Text,
  Title,
} from "@ui5/webcomponents-react";
import type { BomItem } from "@/types/bom";

export function BomProperties({ item }: { item: BomItem | undefined }) {
  if (!item) {
    return (
      <div className="empty-panel">
        <Title level="H3">Item properties</Title>
        <Text>Select an item to inspect its properties.</Text>
      </div>
    );
  }

  const state = item.status === "Released" ? "Positive" : item.status === "Optional" ? "Information" : "Critical";

  return (
    <div className="properties-panel">
      <div className="properties-heading">
        <span className="eyebrow">Selected item</span>
        <Title level="H3">{item.name}</Title>
        <Text>{item.materialId} / level {item.level}</Text>
      </div>
      <Form accessibleMode="Display" headerText="Item properties" labelSpan="S12 M5 L5 XL5">
        <FormGroup headerText="Identity">
          <FormItem labelContent={<Label>Material number</Label>}>
            <Text>{item.materialNumber}</Text>
          </FormItem>
          <FormItem labelContent={<Label>Material ID</Label>}>
            <Text>{item.materialId}</Text>
          </FormItem>
          <FormItem labelContent={<Label>Status</Label>}>
            <ObjectStatus state={state}>{item.status}</ObjectStatus>
          </FormItem>
        </FormGroup>
        <FormGroup headerText="Quantity">
          <FormItem labelContent={<Label>Quantity</Label>}>
            <Text>{item.quantity}</Text>
          </FormItem>
          <FormItem labelContent={<Label>Unit</Label>}>
            <Text>{item.unit}</Text>
          </FormItem>
          <FormItem labelContent={<Label>Level</Label>}>
            <Text>{item.level}</Text>
          </FormItem>
        </FormGroup>
        {item.selectionCondition ? (
          <FormGroup headerText="Selection">
            <FormItem labelContent={<Label>Condition</Label>}>
              <Text>{item.selectionCondition}</Text>
            </FormItem>
          </FormGroup>
        ) : null}
      </Form>
    </div>
  );
}