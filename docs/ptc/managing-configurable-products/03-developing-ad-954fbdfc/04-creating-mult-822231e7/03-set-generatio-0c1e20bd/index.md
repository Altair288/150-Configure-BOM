# Set Generation Information: Specifying Actions and Attributes for Variant Specifications and Module Variants

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsMultipleVarSpecVarModuleSetGenerationInfo.html)  
> 获取日期：2026-11-12

<a id="wwID0EBMVT"></a>

<a id="wwID0ESMVT"></a>

In the **Set Generation Information** step, information is gathered to provide directions for the processing on any valid solution from the unique user input combinations to handle variant specification and variant actions.

<a id="wwID0E3MVT"></a>

For the variant specification, this entails directions on the actions to be taken when:

<a id="wwID0EVNVT"></a>

- one or more matching variant specifications are found.

<a id="wwID0EXOVT"></a>

- information is required in the event a variant specification should be created.

<a id="wwID0EZPVT"></a>

- one or more variants are found.

<a id="wwID0EMQVT"></a>

The resulting variant specifications and variants are consistent with the results of:

<a id="wwID0EFRVT"></a>

- individually configuring each of the unique input combinations.

<a id="wwID0EHSVT"></a>

- selecting the same solution for generation.

<a id="wwID0EJTVT"></a>

- applying the same actions for the variant specification and variant.

<a id="wwID0E3TVT"></a>

To complete the **Set Generation Information** step:

<a id="wwID0E1UVT"></a>

1. In the **Variant Specifications** section, select the variant specification actions from one of the following:

<a id="wwID0EDWVT"></a>

- Select **Always Create New Variant Specifications** if you want to create new variant specifications, even when a matching variant specification exists, for unique combinations with valid solutions.

<a id="wwID0EJXVT"></a>

- Select **Use Existing Latest Matching Variant Specifications** if you want to reuse an existing matching variant specification to avoid creating duplicate objects. The most recently modified will be used if there is more than one matching variant specification. This is the default selected option.

<a id="wwID0EQYVT"></a>

2. In the **New Variant Specification Attributes** section, enter **Location** for the variant specifications.

|  |  |
| --- | --- |
| **![\*](../../../../images/6652ad397dd1_note_16x16.png)** | The **Expose Organization** preference must be set to **Yes** for **Organization ID** or **CAGE Code** to appear. |

<a id="wwID0EF2VT"></a>

3. Provide information for the **New Variant Specification Name Information** section to generate the names for the variant specifications as it conforms to site business processes. Ensure the appropriate name components are selected to configure the variant specification name generation using at least one of the following:

<a id="wwID0EO3VT"></a>

- **Prefix**—Value to be used at the start of the name for any variant specification to be created. The configurable module name is provided as a default value.

<a id="wwID0ET4VT"></a>

- **Delimiter**—A single character delimiter. The default delimiter is a hyphen (-).

<a id="wwID0EY5VT"></a>

- **Use Parameter value**—Identifies the parameter, from the “Set Parameters” step, from which value will be used when creating the variant specification. By default, these default to the first two parameters identified to be variable.

<a id="wwID0E46VT"></a>

- **Suffix**—Value to be used at or near the end of the name for any variant specification to be created.

<a id="wwID0ECBWT"></a>

- **Sequence Number**—Sequence number to be used at the end of the name for any variant specification to be created to increase the likelihood that the name is unique. The sequence must be a positive integer where zero (0) is allowed, that is, the value cannot be less than 0.

<a id="wwID0EHCWT"></a>

- **Step**—Step must be a positive integer where zero (0) is not allowed. Step is the interval value, which must be greater than 0, for the sequence number.

<a id="wwID0E3CWT"></a>

1. Use the checkbox to enable the attribute to be included in the variant specification name where at least one attribute is required. The information provided will be used for any variant specifications created.

|  |  |
| --- | --- |
| **![\*](../../../../images/887c9a51d571_tip_16x16.png)** | Ensure the combination of all values does not exceed the allowable length for the variant specification to ensure generated names exactly match the information provided. |

<a id="wwID0EMEWT"></a>

4. In the **Variants** section, select the variant actions from one of the following:

<a id="wwID0EVFWT"></a>

- Select **Use Checked In or Update Checked Out Existing Latest Matching Variant** to reuse the existing matching variants and associate them to the corresponding variant specifications that will be generated. When no variants fit these descriptions, a variant will be created. This is the default option selected.

<a id="wwID0E2GWT"></a>

- Select **Revise Checked In or Update Checked Out Existing Latest Matching Variant** to revise or update existing matching variants, if any, and generate and associate the variants to the corresponding variant specifications that will be generated. When no variants fit these descriptions, a variant will be created.

<a id="wwID0EBIWT"></a>

- Select **Always Create New Variant** to create new module variants if you do not want to reuse or update, or revise or update existing matching variants.

<a id="wwID0EIJWT"></a>

5. Click **Next** to proceed to the “Set Generation” step or click **Cancel** to exit the process.
