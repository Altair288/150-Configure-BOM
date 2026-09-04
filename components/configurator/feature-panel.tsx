"use client";

import {
  CheckBox,
  MessageStrip,
  ObjectStatus,
  RadioButton,
  Text,
  Title,
} from "@ui5/webcomponents-react";
import type { Feature } from "@/types/feature";
import type { ConfigurationResult } from "@/types/configuration";

interface FeaturePanelProps {
  features: Feature[];
  result: ConfigurationResult;
  onOptionChange: (feature: Feature, optionCode: string, checked: boolean) => void;
}

export function FeaturePanel({ features, result, onOptionChange }: FeaturePanelProps) {
  return (
    <div className="feature-panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Configuration</span>
          <Title level="H2">Select product options</Title>
        </div>
        <ObjectStatus state={result.warnings.length > 0 ? "Critical" : "Positive"} showDefaultIcon>
          {result.warnings.length > 0 ? "Review required" : "Configuration valid"}
        </ObjectStatus>
      </div>
      {result.warnings.map((warning) => (
        <MessageStrip key={warning} design="Critical">
          {warning}
        </MessageStrip>
      ))}
      <div className="feature-list">
        {features.map((feature) => {
          const selectedOptions = result.selectedOptions[feature.id] ?? [];
          const disabledOptions = result.disabledOptions[feature.id] ?? [];

          return (
            <section className="feature-group" key={feature.id} data-testid={`feature-${feature.code}`}>
              <div className="feature-group-header">
                <div>
                  <Title level="H3">{feature.name}</Title>
                  <Text>{feature.description}</Text>
                </div>
                <span className="feature-required">{feature.required ? "Required" : "Optional"}</span>
              </div>
              <div className="option-list">
                {feature.options.map((option) => {
                  const disabled = disabledOptions.includes(option.code);
                  const checked = selectedOptions.includes(option.code);
                  const label = disabled ? `${option.name} - unavailable` : option.name;

                  return (
                    <div className={`option-row ${disabled ? "is-disabled" : ""}`} key={option.id}>
                      {feature.type === "SingleSelect" ? (
                        <RadioButton
                          name={feature.id}
                          text={label}
                          value={option.code}
                          checked={checked}
                          disabled={disabled}
                          data-testid={`option-${option.code}`}
                          onChange={() => onOptionChange(feature, option.code, true)}
                        />
                      ) : (
                        <CheckBox
                          text={label}
                          value={option.code}
                          checked={checked}
                          disabled={disabled}
                          data-testid={`option-${option.code}`}
                          onChange={(event) => onOptionChange(feature, option.code, event.currentTarget?.checked ?? false)}
                        />
                      )}
                      <span className="option-description">{option.description}</span>
                      <span className="option-material">{option.materialNumber}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}