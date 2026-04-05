# SRTM Elevation Bias in Coastal Flood Risk Assessment

Global assessments of sea level rise vulnerability have long relied on the Shuttle Radar Topography Mission (SRTM) digital elevation model — the most widely used global terrain dataset. However, SRTM contains a systematic positive bias: it measures the tops of trees and buildings rather than the ground beneath. Spaceborne lidar indicates a [global mean bias of 1.9 meters](https://pmc.ncbi.nlm.nih.gov/articles/PMC6820795/) in the 1–20 m coastal elevation band, with mean errors of 3.7 m in the U.S. and 2.5 m in Australia as measured against airborne lidar. In high-density urban areas (population density exceeding 20,000/km², such as Miami, New York City, and Boston), SRTM's linear vertical bias reaches [4.71 meters](https://pmc.ncbi.nlm.nih.gov/articles/PMC6820795/).

The consequence is a large underestimation of risk. When researchers applied a neural-network correction to SRTM trained on U.S. airborne LiDAR ([CoastalDEM](https://www.nature.com/articles/s41467-019-12808-z)), the estimated number of people living on land threatened by rising seas roughly tripled under low-emission 2100 projections. A separate effort correcting CopernicusDEM using spaceborne LiDAR from ICESat-2 and GEDI produced [DeltaDTM](https://www.nature.com/articles/s41597-024-03091-9), a global coastal terrain model with substantially reduced vertical error. Both datasets indicate that SRTM-based coastal planning has systematically understated exposure.

## Core Technical Roots

### Radar vs. Ground Truth

SRTM data was [collected](https://www.jpl.nasa.gov/missions/shuttle-radar-topography-mission-srtm) in February 2000 using C-band radar interferometry from the Space Shuttle. Radar signals bounce off the "scattering center" of the landscape — which includes vegetation canopies, building roofs, and infrastructure. In forested areas, SRTM measures an elevation between the ground and the canopy top; in cities, it measures rooftops.

For coastal flood modeling, the relevant metric is bare-earth terrain elevation. SRTM's positive bias effectively lifts low-lying coastal land on digital maps, placing it above flood risk zones on paper. This degree of error [exceeds projected sea-level rise](https://pmc.ncbi.nlm.nih.gov/articles/PMC6820795/) this century under almost any scenario.

### The Population Exposure Multiplier

In 2019, Kulp and Strauss published [CoastalDEM](https://www.nature.com/articles/s41467-019-12808-z), a neural-network-corrected version of SRTM trained on airborne LiDAR data from the United States. The re-analysis of global exposure showed the extent of the previous underestimation:

*   **Current high tide exposure:** SRTM estimated [28 million](https://pmc.ncbi.nlm.nih.gov/articles/PMC6820795/) people lived below the high tide line. CoastalDEM corrected this to 110 million — a nearly fourfold increase.
*   **Current annual flood exposure:** SRTM estimated [65 million](https://pmc.ncbi.nlm.nih.gov/articles/PMC6820795/) people on land subject to annual flooding. CoastalDEM revised this to 250 million.
*   **2100 projections:** Under a high-emissions scenario (RCP 8.5, K17 model with Antarctic ice sheet instability), CoastalDEM estimates [480 (380–630) million](https://pmc.ncbi.nlm.nih.gov/articles/PMC6820795/) people (90% CI) could live on land below projected annual flood levels, compared to 170 (110–260) million estimated using uncorrected SRTM under the same scenario.

The paper's abstract notes that CoastalDEM-based figures [triple SRTM-based values](https://pmc.ncbi.nlm.nih.gov/articles/PMC6820795/) specifically for population on land below projected 2100 high tide lines under low emissions (RCP 2.6). The correction did not change sea level projections; it changed the understanding of the land's elevation. These are better estimates with their own uncertainty ranges, not definitive ground truth — CoastalDEM's RMSE is 2.46 m as measured against airborne lidar in Australia (2.39 m in the U.S., where the model was trained), far better than SRTM but still significant.

### Geographic Concentration of Error

SRTM error is not randomly distributed. It correlates with dense vegetation (mangroves, deltas) and dense settlement (cities) — factors that [concentrate](https://pmc.ncbi.nlm.nih.gov/articles/PMC6820795/) vulnerable populations.

Eight Asian nations — China, Bangladesh, India, Vietnam, Indonesia, Thailand, the Philippines, and Japan — contain [more than 70%](https://pmc.ncbi.nlm.nih.gov/articles/PMC6820795/) of the global population on land below projected 2100 high tide lines. Among these, six countries (China, Bangladesh, India, Vietnam, Indonesia, and Thailand) account for approximately [237 million people](https://www.climatecentral.org/climate-matters/new-report-triples-estimates-of-vulnerability-to-sea-level-rise) facing annual coastal flooding by 2050 — nearly quadrupling earlier SRTM-based estimates, according to Climate Central's reporting on the same Kulp and Strauss study.

### Early-Stage Acceleration

The GLL_DTM elevation model, first published in [2020](https://www.mdpi.com/2072-4292/12/17/2827) (v1, by Vernimmen et al.) using NASA's ICESat-2 satellite LiDAR, was updated to v2 for a [2023 analysis](https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2022EF002880) of global coastal flood exposure. That analysis found that the flattest, most extensive coastal areas are often at the very lowest elevations (0–1 meter). Unlike radar-based models, which suggested a gradual increase in flooded area, the LiDAR data shows the [fastest increase in exposed land occurring in the early stages](https://climateattribution.org/resources/new-lidar-based-elevation-model-shows-greatest-increase-in-global-coastal-exposure-to-flooding-to-be-caused-by-early-stage-sea-level-rise/) of sea level rise — in nearly all countries within the first 2 meters. In [one-third of countries](https://climateattribution.org/resources/new-lidar-based-elevation-model-shows-greatest-increase-in-global-coastal-exposure-to-flooding-to-be-caused-by-early-stage-sea-level-rise/), most of this increase in exposure to flooding is projected to occur within the first meter. The authors note that the time available to prepare for increased exposure [may be considerably less](https://climateattribution.org/resources/new-lidar-based-elevation-model-shows-greatest-increase-in-global-coastal-exposure-to-flooding-to-be-caused-by-early-stage-sea-level-rise/) than assumed to date.

## Social and Planning Implications

### Planning on Overstated Elevation

For two decades, coastal planners, engineers, and insurers used SRTM-derived data. Vulnerability maps and adaptation plans developed during this period inherited SRTM's bias. A [2016 study](https://www.frontiersin.org/journals/earth-science/articles/10.3389/feart.2016.00036/full) found that SRTM underpredicts U.S. population exposure by more than 60% at 3 meters elevation. Separately, the same study found the prevalence of underprediction across jurisdictions becomes near-universal at 10 meters — affecting 86% of municipalities, 92% of counties, and 95% of states.

### The Sub-Meter Problem

Researchers have [concluded](https://www.frontiersin.org/journals/earth-science/articles/10.3389/feart.2018.00230/full) that current global DEMs are not adequate for high-confidence mapping of exposure to fine increments (<1 m) of sea level rise. While newer models like [DeltaDTM](https://www.nature.com/articles/s41597-024-03091-9) (2024) — which corrects CopernicusDEM using ICESat-2 and GEDI spaceborne LiDAR — have reduced mean absolute error to 0.45 meters (with a bias of 0.01 m and RMSE of 0.74 m across all land cover classes), this still falls short of the precision required for neighborhood-level planning. High-confidence assessment typically requires airborne LiDAR, which remains [unavailable or prohibitively expensive](https://pmc.ncbi.nlm.nih.gov/articles/PMC6820795/) in most of the world outside the U.S., coastal Australia, and parts of Europe — creating a gap where the most vulnerable populations have the least accurate maps.

### Wetland Mapping Limitations

Coastal wetlands provide flood protection but are difficult to map accurately. Even corrected datasets struggle to penetrate dense marsh vegetation. Hladik and Alber ([2012](https://www.sciencedirect.com/science/article/abs/pii/S0034425712000557)) found that LiDAR-derived salt marsh DEMs had systematic positive bias ranging from 0.03 to 0.25 meters depending on vegetation cover class, with overall mean error of 0.10 m. They note that elevation differences of less than 10 cm can affect plant distributions and marsh productivity in these environments. If models overstate wetland elevation, they understate how often wetlands are inundated and how likely they are to be lost, obscuring the condition of natural barriers protecting coastal residents.

### The Correction Lag

While improved datasets — CoastalDEM (2019), GLL_DTM ([2020](https://www.mdpi.com/2072-4292/12/17/2827)/[2023](https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2022EF002880)), DeltaDTM ([2024](https://www.nature.com/articles/s41597-024-03091-9)) — now exist, the installed base of SRTM-derived products remains large. Older assessments continue to be cited in [policy documents](https://www.frontiersin.org/journals/earth-science/articles/10.3389/feart.2018.00230/full), propagating the original bias.
