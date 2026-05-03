# Flint, ZIP Codes, and the Modifiable Areal Unit Problem

In April 2014, Flint changed its water supply from Detroit-supplied Lake Huron water to the Flint River while under state-appointed emergency management, according to [Hanna-Attisha et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC4985856/) and the [Flint Water Advisory Task Force (FWATF)](https://www.michigan.gov/-/media/Project/Websites/formergovernors/Folder6/FWATF_FINAL_REPORT_21March2016.pdf). During the early period of the crisis, MDEQ continued to reassure officials and the public that the water was safe, and the FWATF later found that state agencies did not adequately respond to evidence of lead exposure. A subsequent re-analysis by the Hurley Children's Hospital/Michigan State University team found a statistically significant increase in elevated blood lead levels (EBLLs) among Flint children under five. The divergence did not primarily turn on a dispute about whether blood-lead measurements existed, but on how those measurements were spatially grouped and interpreted.

The key geographic problem was that Flint ZIP codes did not align with the city or its water system. In Richard Casey Sadler's Flint-specific explanation, the city boundary and water system were "almost 100 percent coterminous," while Flint mailing ZIP codes extended into surrounding municipalities; Sadler reports that ZIP-code aggregation mixed children using Flint water with children outside the city who were not using Flint water ([Sadler, originally published in *The Conversation* and republished by Visionscarto](https://www.visionscarto.net/zip-codes-flint)). Because ZIP codes are postal delivery tools rather than stable exposure boundaries, aggregating BLLs by ZIP code could dilute a water-system-specific signal.

The re-analysis, published by [Hanna-Attisha et al. in the *American Journal of Public Health*](https://pmc.ncbi.nlm.nih.gov/articles/PMC4985856/), reviewed BLLs for children under five before and after the water-source change, geocoded addresses, and used spatial analysis. The percentage of Flint children under five with EBLLs (>=5 ug/dL) rose from 2.4% pre-switch (January 1-September 15, 2013) to 4.9% post-switch (January 1-September 15, 2015); in high-water-lead Flint wards, EBLLs increased from 4.0% to 10.6%; and outside Flint water, the change from 0.7% to 1.2% was not statistically significant. The FWATF's March 2016 Final Report characterized the crisis as "a story of government failure, intransigence, unpreparedness, delay, inaction, and environmental injustice" and found that MDEQ bore primary responsibility for the water contamination in Flint.

## Core Technical Roots

### ZIP Codes and the Water System Do Not Share a Boundary

Sadler reports that the City of Flint and its water system were nearly coterminous during the crisis, while residential ZIP codes with Flint mailing addresses crossed municipal boundaries. Specifically, only ZIP codes **48502** and **48503** lay completely within Flint; **48504**, **48505**, **48506**, and **48507** were split between Flint and outlying municipalities; and **48532** contained very few homes in the city of Flint ([Sadler](https://www.visionscarto.net/zip-codes-flint)). This matters because the exposure of interest was the Flint municipal water system, not the mailing address label.

That mismatch is consistent with how ZIP codes are designed. The [U.S. Census Bureau](https://www.census.gov/programs-surveys/geography/guidance/geo-areas/zctas.html) explains that ZIP Codes were created by USPS to coordinate mail handling and delivery, and that Census ZIP Code Tabulation Areas are generalized areal representations of ZIP Code delivery patterns. USPS likewise states that ZIP Codes reflect post offices, delivery units, and carrier routes and do not always match municipal boundaries ([USPS ZIP Code basics](https://faq.usps.com/articles/Knowledge/ZIP-Code-The-Basics)).

### The Dilution Effect

Sadler reports that about one-third of homes with Flint ZIP codes were outside the city; expressed relative to the number of city homes, that meant roughly 50% more addresses were being added from outside the exposed municipal water system ([Sadler](https://www.visionscarto.net/zip-codes-flint)). Hanna-Attisha et al. similarly note that their spatial analysis was undertaken to overcome ZIP-code limitations and that one third of Flint mailing addresses were not in the city of Flint. The practical effect was that ZIP-code summaries for "Flint" could include children on different water systems, reducing the visibility of the Flint-water signal.

### The Modifiable Areal Unit Problem

The ZIP-code approach illustrates the **Modifiable Areal Unit Problem (MAUP)**: results based on aggregated spatial data can change when the scale or boundary configuration of the areal units changes. A review entry on MAUP explains that changing the size, shape, or orientation of areal units can substantially alter results from the same underlying data ([Manley, 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7151983/)). In this case, ZIP codes were a poor unit because they were not designed to represent water-service exposure; Census and USPS documentation confirm that ZIP/ZCTA geography is derived from postal delivery patterns rather than municipal or infrastructure boundaries.

### The Corrective: Parcel-Level Geocoding and Kriging

Rather than relying on ZIP aggregates, Hanna-Attisha et al. geocoded each child's residential address using a dual-range address locator, manually confirmed geocoding accuracy, and spatially joined records to Greater Flint municipalities and Flint wards. They then used ordinary Kriging with a spherical semivariogram model across Greater Flint to interpolate associated BLL risk with lead in water. The authors explicitly state that they assumed lead risk was spatially correlated in Greater Flint because of the age and condition of pipes, and they describe Kriging as a method that weights nearby measured values more strongly while using geostatistical models that consider spatial autocorrelation.

The study's Flint sample included 1,473 children: 736 in the pre-switch period and 737 in the post-switch period, approximately 22 points per square mile ([Hanna-Attisha et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC4985856/)). The resulting GIS analysis identified significant clustering of EBLLs within Flint city limits and showed that high predicted BLLs corresponded with wards where water samples exceeded 15 ppb.

## The Statistical Result

The comparison periods were January 1-September 15 of 2013 (pre-switch) and January 1-September 15 of 2015 (post-switch), as specified by Hanna-Attisha et al. The results below come from the peer-reviewed article's reported EBLL percentages and ward table.

**Table 1: Incidence of elevated blood lead levels (>=5 ug/dL) in Flint children under 5**

| Geographic area | Pre-switch (2013) | Post-switch (2015) | Change | Significance |
| :--- | :--- | :--- | :--- | :--- |
| Flint overall | 2.4% | 4.9% | +2.5 pp | *p* < .05 |
| High-water-lead wards | 4.0% | 10.6% | +6.6 pp | *p* < .05 |
| Ward 5 | 4.9% | 15.7% | +10.8 pp | *p* < .05 |
| Outside Flint water | 0.7% | 1.2% | +0.5 pp | Not significant |

The Ward 5 EBLL percentage approximately tripled over the period. The outside-Flint comparison group -- children living outside the city where the water source was unchanged -- showed no statistically significant change. Hanna-Attisha et al. concluded that the spatial and statistical analyses highlighted the greatest EBLL increase within certain Flint wards and that those wards corresponded to areas of elevated water lead levels.

## Social and Institutional Consequences

### Delayed Acknowledgment

The FWATF found that neither the Governor nor the Governor's office reversed poor decisions by MDEQ and state-appointed emergency managers until October 2015, in part because of continued reassurances from MDEQ that the water was safe. It also found that MDEQ misinterpreted and misapplied the Lead and Copper Rule, under-reported lead-in-water levels, and prolonged residents' exposure to high lead levels; separately, it found that MDHHS's lack of timely analysis and understanding of its childhood blood-lead data, reliance on MDEQ, and reluctance to share data with Dr. Mona Hanna-Attisha and Professor Marc Edwards prolonged the crisis ([FWATF Final Report](https://www.michigan.gov/-/media/Project/Websites/formergovernors/Folder6/FWATF_FINAL_REPORT_21March2016.pdf)).

The ZIP-code aggregation choice fit within that broader institutional pattern: it produced a reassuring aggregate picture that could be used, or at least interpreted, as evidence against urgent policy reversal. This is an interpretation grounded in the documented sequence: Sadler reports that the state summarized blood-lead statistics by ZIP code and concluded that the water-source change had no discernible effect, while the FWATF documents state-level reassurances and delayed acknowledgment.

### Environmental Justice and Aggregation

Hanna-Attisha et al. report that geospatial analysis identified disadvantaged neighborhoods as having the greatest EBLL increases and that overall socioeconomic disadvantage differed significantly between outside Flint, high-water-lead Flint, and lower-water-lead Flint. The article also states that Flint children already faced lead-exposure risk factors including poor nutrition, concentrated poverty, and older housing stock. The FWATF separately found that the Flint water crisis was a clear case of environmental injustice.

The Hanna-Attisha ward-level results, especially Ward 5 and high-water-lead wards 5, 6, and 7, provided spatial resolution that ZIP-code aggregation obscured. Hanna-Attisha et al. explicitly note that aggregation by ZIP code or ward can minimize spatial variation and create artificial barriers that obscure hot spots, including the confluence of wards 3, 4, and 5.

### Broader Lessons for Spatial Surveillance

The Flint case is a specific instance of a general spatial-data problem: environmental-exposure analyses are sensitive to the unit at which point-level data are aggregated. MAUP literature documents that changing aggregation boundaries can change measured patterns, while Census and USPS documentation show that ZIP/ZCTA geography is based on mail-delivery geography rather than exposure, infrastructure, or municipal boundaries. For exposures tied to infrastructure, the relevant unit should be aligned with the infrastructure when possible; for neighborhood-level social analysis, smaller and more internally comparable units such as census block groups may better approximate local conditions than ZIP codes. Hanna-Attisha et al. used census block group variables to measure neighborhood-level socioeconomic disadvantage, which is a more direct fit for that purpose than ZIP-code aggregation.

## Conclusion

The Flint case is not primarily a story about a single wrong number. Both the state-facing ZIP-code summary and the Hanna-Attisha re-analysis addressed the same public-health signal -- child blood-lead levels during the Flint water crisis -- but the interpretation changed when records were geocoded and analyzed at a spatial unit aligned with the water-service exposure. ZIP-code aggregation crossed the water-system boundary and could smooth exposed and unexposed populations together; the parcel-level approach allowed the signal in affected wards to surface. The governance lesson is that the choice of spatial unit is not a neutral technical step: it can determine whether a public-health change registers as a crisis or as noise.
