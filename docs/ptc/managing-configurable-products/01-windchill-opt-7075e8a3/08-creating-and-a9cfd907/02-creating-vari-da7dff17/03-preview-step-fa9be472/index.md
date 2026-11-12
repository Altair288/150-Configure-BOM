# Preview Step: Reusing Existing Variant Specifications and Variants

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsReusingVariantsSpecVariants.html)  
> 获取日期：2026-11-12

<a id="wwID0EK5PS"></a>

<a id="wwID0E25PS"></a>

The Preview step allows you to either reuse any of the matching existing variant specifications or variants, or continue with the configuration process and create a new variant specification.

<a id="wwID0EE6PS"></a>

## Possible Matching Results

<a id="wwID0EI6PS"></a>

The **Matching Variant Specifications** table identifies the variant specifications and variants parts that match the user-specified and rule driven choices and the resulting structure (inclusive of the advanced logic user-specified or constraint driven parameter values). The following matching scenarios are possible:

| Scenario type | Description |
| --- | --- |
| Scenario 1: Both the variant specification and the variant part match | Identifies the existing variant specifications that match the user-specified and rule driven choices and the resulting structure (inclusive of the advanced logic user-specified or constraint driven parameter values) where the variant part matches as well. The **Matching Variant Specifications** table shows the matching variant specification and the matching variant, with the status for the variant indicating Matching Variant. |
| Scenario 2: Only the variant specification matches | Identifies the existing variant specifications that match the user-specified and rule driven choices and the resulting structure (inclusive of the advanced logic user-specified or constraint driven parameter values) where the variant part does not match. The **Matching Variant Specifications** table shows the matching variant specification, and lists the variant part with the status Non-Matching Variant. |
| Scenario 3: The matching variant specification does not have a variant part | Identifies the existing variant specifications that match the user-specified and rule driven choices and the resulting structure (inclusive of the advanced logic user-specified or constraint driven parameter values) where the variant part does not exist. The **Matching Variant Specifications** table shows only the matching variant specifications. |

<a id="wwID0E2EQS"></a>

## Completing the Preview Step

<a id="wwID0ETFQS"></a>

1. Review the matches in the **Matching Variant Specifications** table.

<a id="wwID0EZGQS"></a>

2. Select one of these actions:

<a id="wwID0E5HQS"></a>

- **Go to selected Variant Specification information page**—Valid for the scenarios #1, #2, #3. Click **Finish** to close the window and go to the information page of the existing variant specification you selected.

<a id="wwID0EHJQS"></a>

- **Go to selected Module Variant information page**—Valid for the scenarios #1 and #2. Click **Finish** to close the window and go to the information page of the existing variant part you selected.

<a id="wwID0EQKQS"></a>

- **Use selected Variant Specification**—Valid for the scenarios #2 and #3. When you click **Next** to continue with the configuration process, input values for the current variant specification are set to those from the selected variant specification.

<a id="wwID0EZLQS"></a>

- **Create a new Variant Specification**—Available for all scenarios. Click **Next** to continue with the configuration process to create a variant specification and request deliverables.

<a id="wwID0EDNQS"></a>

3. Click **Next** to go to the next, or click **Finish** to complete the configuration.
