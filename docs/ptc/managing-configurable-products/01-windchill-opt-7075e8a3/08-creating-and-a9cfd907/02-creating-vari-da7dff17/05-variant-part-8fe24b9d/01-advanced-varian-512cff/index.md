# Advanced Variant Generation

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsAdvVariantGeneration.html)  
> 获取日期：2026-11-12

<a id="wwID0E64QS"></a>

<a id="wwID0ET5QS"></a>

## Controlling the Ability to Create Variant Parts

<a id="wwID0EX5QS"></a>

The **Variant Requestor set to Generic User** preference available under the **Options and Variants** node allows an administrator to control who can create deliverables (variant parts) for a selected structure. If the preference is set to **Yes**, then the creator of the variant part is determined by the value of the com.ptc.dto.delivery.guy property located in the codebase\\com\\ptc\\wpcfg\\wpcfg.properties file. If the preference is set to **No**, then the current user who requested the deliverables is the variant part creator.

<a id="wwID0EZ6QS"></a>

## Enabling Email Notification

<a id="wwID0E46QS"></a>

You can enable email notification to the user who requested a deliverable when the deliverable is successfully generated. To do this, log in as a site administrator, add the property com.ptc.dto.deliverables.email.notification.enabled to the wpcfg.properties file, and set it to “true”.
