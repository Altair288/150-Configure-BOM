# Managing Choice Rules in the Option Set

> 来源：PTC Windchill Help Center（R13.1.2.0）  
> 原文：[PTC Help Center](https://support.ptc.com/help/windchill/r13.1.2.0/en/Windchill_Help_Center/options/OptionsRulesMappingConstraint.html)  
> 获取日期：2026-11-12

<a id="wwID0EEQNR"></a>

<a id="wwID0EVQNR"></a>

When you add choices to the option set, these choices can be governed by the rules that were defined within the option pool. The rules created in the option pool are referred to as **global rules**. The rules that are created in the option set are referred to as **local rules**.

<a id="wwID0EFRNR"></a>

There are two approaches to managing inherited global rules:

<a id="wwID0E5RNR"></a>

- If **Reference Option Pool Rules Automatically** is set to **Yes** for the option set, rules are inherited when choices are added to the option set, and you cannot manage the rules within the option set. You can only create local rules for the option set. If a global or local rule has multiple revisions, the rule revision used by the system is determined by the configuration specification criteria specified in the **Option Filter** tab in the **Edit Filter** window.

<a id="wwID0EQTNR"></a>

- If **Reference Option Pool Rules Automatically** is set to **No** for the option set, you can decide which global rules to include in the option set. You can also create local rules.

<a id="wwID0ELUNR"></a>

Consider this information about global and local rules:

<a id="wwID0EEVNR"></a>

- For a global exclude rule to be inherited by the option set, at least one choice referenced by the rule must be present in the option set.

<a id="wwID0EGWNR"></a>

- For a global include or enable rule to be inherited by the option set, the source choice and at least one target choice must be present in the option set. For example, if an include rule I1 is defined as US=English, Right, then you need the source choice US and at least one of the target choices English or Right for the include rule to be valid in the option set.

<a id="wwID0E3XNR"></a>

- For a global conditional rule to be inherited by the option set, at least one choice must be in the **If** section of the rule and at least one choice must be in the **Then** section of the rule.

<a id="wwID0EGZNR"></a>

- Local rules are defined only within the option set, and they do not exist outside that option set.

<a id="wwID0E6ZNR"></a>

## Status of Global Rules

<a id="wwID0ED1NR"></a>

When you are managing the global rules membership for the option set, the candidate rules table displays the status of the rule for the selected option set. The following status values can be shown:

<a id="wwID0E21NR"></a>

- **Add** – Add the rule to the option set. The rule is not yet present in the option set.

<a id="wwID0EA3NR"></a>

- **Update** – The rule has been modified in an option pool, and the option set includes an older iteration of that rule. You can update the rule in the option set to use the latest iteration of the rule.

<a id="wwID0EF4NR"></a>

- **Remove** – The option set has a global rule that is no longer valid for the option set, and you need to remove the rule.

<a id="wwID0EZ4NR"></a>

- For example, a global include rule was changed in the option pool to include different choices, and some of the choices referenced by the rule are not part of the option set. When you update the rules for the option set, since the target choices defined by this include rule are no longer in the option set, the new iteration of the include rule is not valid for the option set.

<a id="wwID0ED5NR"></a>

## Managing Iterations of Global Rules Added to the Option Set

<a id="wwID0EH5NR"></a>

Global rules can be revised and iterated.

<a id="wwID0EL5NR"></a>

Consider this information on how versions of the choice rules are managed for the options set:

<a id="wwID0ED6NR"></a>

- If a global rule was iterated after it had been added to the option set, the option set uses the latest rule iteration.

<a id="wwID0EFAOR"></a>

- The candidate rules table shows the latest iteration of the latest version of the choice rules for those rules that were inherited from the option pool.

<a id="wwID0EHBOR"></a>

- The ignored rules table shows the latest iteration of the latest version of the rules listed in the table.

<a id="wwID0EZBOR"></a>

If you want the option set to use an earlier iteration of the rule that was added explicitly, click the revert action ![](../../../../../images/7af1c6602d66_IconUndoOptionSetOverride.gif) located on the table toolbar.
