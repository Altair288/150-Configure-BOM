# Information Page of a Configurable Module

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsConfigPartInfoPage.html)  
> 获取日期：2026-11-12

<a id="wwID0EI5WR"></a>

<a id="wwID0EZ5WR"></a>

In addition to listing the standard part information, the information page of a configurable module also provides you with the tables and actions specific to Options and Variants. For information on part information page, see [Part Information Page](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/parts/PMPartEndItemDetails.html).

<a id="wwID0EN6WR"></a>

## Information on the Assigned Option Set

<a id="wwID0ER6WR"></a>

You can access information on the assigned option set that is associated with this configurable module by adding a new tab and selecting Customize > General > Assigned Option Set.

<a id="wwID0EMAXR"></a>

From the **Assigned Option Set** table, you can assign an option set to the configurable module. For more information on assigned option sets, see [Assigning an Option Set to an Object](../../03-working-with-op-fa126a/03-assigned-option-set/01-assigning-an-bf00a57c/index.md#wwID0EVWRR "Assigning an Option Set to an Object").

<a id="wwID0EEBXR"></a>

## Information on the Assigned Item Choices

<a id="wwID0EIBXR"></a>

You can view the choices assigned to this configurable module. To see this information, add a new tab and select Customize > General > Assigned Expressions. For more information on assigning item choices, see [Assigning Expressions to Parts](../../05-assigning-expressions/05-assigning-exp-e3633468/index.md#wwID0E5Y2R "Assigning Expressions to Parts").

<a id="wwID0EQCXR"></a>

## Information on the Logic References

<a id="wwID0EUCXR"></a>

You can access information on the logic references by selecting Customize > General > Logic References. The following tables are available:

<a id="wwID0EDEXR"></a>

- The **Logic References** table lists the configurable module to which the current part has a logic reference. From this table, you can add or delete logic references. For more information on logic references, see [Assigning a Logic Reference to Another Configurable Module](../../../03-developing-ad-954fbdfc/01-basic-steps-f-e44610d0/02-assigning-a-l-d6f3940c/index.md#wwID0E5NBT "Assigning a Logic Reference to Another Configurable Module").

<a id="wwID0ETFXR"></a>

- The **Where Used Logic References** table lists the configurable modules that have a logic reference pointing to this configurable module.

<a id="wwID0EOGXR"></a>

## Information on Variants and Variant Specifications

<a id="wwID0ESGXR"></a>

You can access information related to the variant specifications and variant parts that are associated with this configurable module by adding a new tab, selecting Customize > Related Objects, and then selecting **Variant Specifications** and **Variants**. The following tables appear:

<a id="wwID0EDIXR"></a>

- **Variant Specifications** – Lists variant specifications that exist for this option set or configurable module. From this table, you can:

<a id="wwID0ELJXR"></a>

- Compare variant solutions – Select two variant specifications and click ![](../../../../images/bf284e697167_IconVariantSolutionCompare.gif).

<a id="wwID0EUKXR"></a>

- Compare information between two variant specifications. Select two variant specifications and click ![](../../../../images/cf4877739b1e_IconCompare.gif).

<a id="wwID0E4LXR"></a>

- Delete a variant specification – Select variant specifications and click ![](../../../../images/22aa5ed232d8_IconDelete.gif).

<a id="wwID0EHNXR"></a>

- **Module Variants**– Lists variants that are associated with this configurable module. From this table, you can:

<a id="wwID0EPOXR"></a>

- Remove parts from being reused as a variant for the configurable module – Select variant parts and click ![](../../../../images/ae4a236e741a_IconRemove.gif).

<a id="wwID0EYPXR"></a>

- Verify that the part can be reused as a variant for the configurable module— Select the variant part and click ![](../../../../images/51dde020d5f6_IconPartVerify.gif).

<a id="wwID0EBRXR"></a>

- Add the part to the list of parts available for reuse when creating a variant of the configurable module — Select the variant part and click ![](../../../../images/6d92b018efd7_IconAttachAdd.gif).

<a id="wwID0EASXR"></a>

## Information on Requested Multiple Variants

<a id="wwID0EESXR"></a>

You can access information related to the multiple variant generation requests from the **Configure Multiple Variants** action using the **Requested Multiple Variants** table. The table allows you to view the requests for a configurable module. The following values will be available for the status:

<a id="wwID0EFTXR"></a>

- Initiated—Indicates the **Configure Multiple Variants** action was completed and the request has been initiated. The time the request is initiated is also available.

<a id="wwID0ELUXR"></a>

- In Progress—Indicates the queue has picked up the request and processing has started. The time the processing was started is also available.

<a id="wwID0ENVXR"></a>

- Success with No Variants Generated—It is one of four possible completed status values. This status indicates no valid solutions exist for all the parameter value input combinations defined. The time the request was completed is also available.

<a id="wwID0EPWXR"></a>

- Success with All Variants Generated—It is the second of four possible completed status values. This status indicates variants were successfully generated for all solutions from all the parameter value input combinations defined. The time the request was completed is also available.

<a id="wwID0ERXXR"></a>

- Failed—It is the third of four possible completed status values. This status indicates variant generation failed for all solutions from all the parameter value input combinations defined. The time the request was completed is also available.

<a id="wwID0ETYXR"></a>

- Success with Some Variants Generated—It is the fourth of four possible completion status values. This status indicates partial success where at least one variant was successfully generated and at least one other variant failed generation when processing all solutions from all the parameter value input combinations defined. The time the request was completed is also available.

<a id="wwID0EFZXR"></a>

For more information on the queue process, see [Out-of-the-box Background Queues](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/queuemgmt_chp/queuemgmtChp_OutBoxBackgroundQueue.html).

> ![\*](../../../../images/6652ad397dd1_note_16x16.png) **Note:** Ability to view **Requested Multiple Variants** for the **Configure Multiple Variants** action is an advanced capability subject to a separate license entitlement.

<a id="wwID0EX1XR"></a>

To view the **Requested Multiple Variants** table, add a new tab, select Customize > Related Objects, and then select **Requested Multiple Variants**.

<a id="wwID0EU2XR"></a>

The **Requested Multiple Variants** table displays the status summary from **Configure Multiple Variants** requested for a configurable module. From this table, you can:

<a id="wwID0EB3XR"></a>

Remove Requested Multiple Variants—Select the requests and click ![](../../../../images/22aa5ed232d8_IconDelete.gif) to delete the requests.

<a id="wwID0EN3XR"></a>

This action is available only if you are authorized to modify the configurable module. You can use this action to delete one or more completed requests, that is, the failed and successful multiple variant generation requests.
