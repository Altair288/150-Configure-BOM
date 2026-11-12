# Converting Assigned Expressions to Independent Expressions

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsConversionUtility.html)  
> 获取日期：2026-11-12

<a id="wwID0EAH1R"></a>

<a id="wwID0EIH1R"></a>

This utility allows you to convert previously created assigned expressions to independent expression. The utility also sets the environment to support independent expressions.

> ![\*](../../../../../images/6652ad397dd1_note_16x16.png) **Note:** The utility to convert to independent assigned expressions is an advanced capability subject to a separate license entitlement.

> ![\*](../../../../../images/6652ad397dd1_note_16x16.png) **Note:** Once you have successfully run this utility, the system is configured to create independent expressions only.

<a id="wwID0EEJ1R"></a>

Consider this information about the conversion utility:

<a id="wwID0E4J1R"></a>

- The conversion utility converts only the dependent expressions assigned to usage links and occurrences for the latest iteration of the revisions for parts that have assigned expressions.

<a id="wwID0E6K1R"></a>

- To optimize the performance, the utility processes all objects with expressions in chunks.

<a id="wwID0EBM1R"></a>

- The utility operates in phases:

<a id="wwID0EGN1R"></a>

- Phase 1–Gathers and prepares data for the conversion.

<a id="wwID0EIO1R"></a>

- Phase 2–Converts the latest iteration of each revision of assigned expressions to independent assigned expressions.

<a id="wwID0EKP1R"></a>

- Phase 3–Cleans up after the conversion and sets the system to independent assigned expression mode.

<a id="wwID0ENQ1R"></a>

- The utility moves to the next phase only after successfully completing the previous phase. In the event of a failure, it logs the errors, records the phase where the processing has stopped, and starts at this phase on the next run.

<a id="wwID0EPR1R"></a>

- The utility attempts to convert as many objects as possible, marking the ones with errors for reprocessing.

<a id="wwID0ERS1R"></a>

- The utility provides status and error logs to help debug issues.

<a id="wwID0ETT1R"></a>

- The classes that can have independent assigned expressions are WTPart, WTPartUsageLink, and PartUsesOccurrence. The utility converts all existing expressions for these objects to independent assigned expressions.

<a id="wwID0EVU1R"></a>

- The utility provides a mechanism for a business administrator to set up a mapping between configurable module lifecycle states and independent assigned expressions lifecycle states.

> ![\*](../../../../../images/6652ad397dd1_note_16x16.png) **Note:** The system should not be used for new object creation or data manipulation while the conversion is in progress, as it may lead to inconsistent data. If there are errors during the conversion, it is recommended that you resolve errors and rerun the utility to achieve a successful conversion before making any changes to the existing data. New parts and expressions created while the conversion is in progress are not processed by the utility, which may lead to inconsistent data.

<a id="wwID0EPW1R"></a>

## Running the Utility

<a id="wwID0EHX1R"></a>

1. Set the lifecycle state mapping file with the appropriate state-to-state mapping:

<a id="wwID0EYX1R"></a>

WT\_HOME\\com\\ptc\\windchill\\option\\tools\\iae\\IAEConversionStateMapping.properties

<a id="wwID0E4X1R"></a>

1. The left side of the mapping is the state of the parent part whose expressions are being converted, and the right side is the state that must be assigned to the converted expression. The syntax is as follows:

<a id="wwID0EBY1R"></a>

# <Part\_Lifecycle\_State> = <Independent\_Assigned\_Expression\_Lifecycle\_State>

<a id="wwID0EGY1R"></a>

1. Sample entries are as follows:

<a id="wwID0E5Y1R"></a>

- STUDY=INWORK

<a id="wwID0EA11R"></a>

- DEFINITION= INWORK

<a id="wwID0EC21R"></a>

- DEVELOP=INWORK

<a id="wwID0EE31R"></a>

- VERIFY=INWORK

<a id="wwID0EG41R"></a>

- IMPLEMENT=INWORK

<a id="wwID0EI51R"></a>

- COMPLETE=RELEASED

<a id="wwID0EK61R"></a>

- CANCEL=CANCEL

<a id="wwID0E361R"></a>

1. This mapping is applied when assigning a state to the converted expressions. In the absence of the file or entries in the file, the tool defaults to the lifecycle state of the parent configurable module. Note that the state values must be in the enumerated type key format, similar to XML import/export file. Precede blank spaces with “\\”; for example: PENDING\\APPROVAL=PENDING APPROVAL. Note that this is required only on the left portion of the expression before the “=” sign, and is not necessary for the right side of the expression.

<a id="wwID0EWA2R"></a>

2. Ensure that system is ready for the data to be converted.

<a id="wwID0EYB2R"></a>

3. Restart the MethodServer and ServerManager.

<a id="wwID0E1C2R"></a>

4. Run the following command from a windchill shell:

<a id="wwID0ELD2R"></a>

Windchill com.ptc.windchill.option.tools.ConvertToIndependentExpression -u wcadmin -p wcadmin

<a id="wwID0EBE2R"></a>

5. A status is displayed while the conversion is in progress. A confirmation is posted at the end of the process, and failures are also reported.

<a id="wwID0EDF2R"></a>

6. Review the log files:

<a id="wwID0EIG2R"></a>

- WT\_HOME\\logs\\ConvertToIndependentExpression\\error.log

<a id="wwID0EMH2R"></a>

- WT\_HOME\\logs\\ConvertToIndependentExpression\\status.log

|  |  |
| --- | --- |
| **![\*](../../../../../images/6652ad397dd1_note_16x16.png)** | Because the utility appends the report to the existing log files on each run, it is recommended that older logs are renamed and saved as a record. This allows a new log to be created with each run of the utility. |

<a id="wwID0ELJ2R"></a>

7. To confirm that the old expressions have been converted to independent expressions, right-click the usage links with expressions. You should see 2 new menu options: **View Assigned Expression** and **Copy Assigned Expression**. You can also confirm that newly created assigned expressions are independent by going to the View Assigned Expression page.
