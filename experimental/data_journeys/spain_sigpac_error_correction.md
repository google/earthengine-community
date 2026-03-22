# Spain SIGPAC: Governance by Workaround

In July 2025, Spain's Supreme Court ruled that farmers are liable for errors in
the state's own agricultural map (unless they can prove they flagged the
mismatch on time and it wasn’t corrected for reasons not attributable to them).
By submitting the annual subsidy application, the farmer accepts the geospatial
data as correct — even when the error originated in the state's classification
algorithm (SIGPAC) or other sources. The court explicitly rejected the argument
that this imposed an excessive burden on applicants who lack the technical means
to verify complex geodetic accuracy. The institution makes the map. The
institution makes the errors. The farmer must prove they flagged the discrepancy
— or pay for both.

The ruling codified what the system had already produced in practice. In Spain,
as across the European Union, area-based agricultural support is mediated by
maps. SIGPAC (*Sistema de Información Geográfica de Parcelas Agrícolas*) is the
reference layer used to locate and characterize land for surface-linked payments
and controls, as FEGA
[sets out](https://www.fega.gob.es/es/pepac-2023-2027/sistemas-gestion-y-control/sigpac).
But the map can be imperfect — for example, misclassifying pasture as scrub
Rather than treating those
imperfections as a centrally owned data-quality problem, the system outsources
error correction to farmers through a formal *alegación* (allegation) process,
making them responsible for identifying, documenting, and proving errors parcel
by parcel.

## What the Algorithm Sees — and What It Cannot

SIGPAC is built as a national GIS database grounded in orthophotography and
cadastral geometry, worked at a 1:5,000 scale, as a FEGA training deck hosted by
MITECO
[describes](https://www.miteco.gob.es/content/dam/miteco/es/biodiversidad/formacion/sigpac_tcm30-429772.pdf).
A parcel — and especially the *recinto*, the internal reference unit — receives
a land-use label and attributes that become "real" in the administrative sense.

Even when the imagery is sharp, the underlying object is unstable. A fallow
field can become scrubby; pasture is grazed unevenly; agroforestry sits
awkwardly between "pasture" and "forest." A photograph captures a moment; a farm
runs on seasons.

At the EU level, the European Court of Auditors has pointed to the limits of
photo-interpretation for eligibility layers. In its LPIS audit, the Court
[notes](https://www.eca.europa.eu/lists/ecadocuments/sr16_25/sr_lpis_en.pdf)
that photo-interpretation "was not always reliable," contributing to incorrect
maximum eligible areas in some implementations. That report is largely about
over-eligibility errors (too much land deemed eligible). The mirror-image error
— eligible land recorded as less eligible than it is — creates a quieter
problem: income loss that does not produce the same level of administrative
alarm, because it looks like "compliance."

### Pasture as a Computed Surface

Pasture is the stress test. Mediterranean grazing areas are often a mix of
herbaceous cover, shrub, scattered trees, rock, slope, and seasonal dynamics.
Spain historically applied the *Coeficiente de Admisibilidad de Pastos* (CAP)
and, from 2023, moved to the *Coeficiente de Subvencionabilidad de Pastos*
(CSP), as FEGA
[summarizes](https://www.fega.gob.es/es/node/8079/printable/print).

CSP is a computed percentage: the share of a pasture parcel deemed eligible
after discounting what the algorithm treats as limiting — excessive slope, bare
ground, non-pasturable shrub, tree cover, buildings
([FEGA CSP note](https://www.fega.gob.es/sites/default/files/files/document/230302_nota_web_csp_2023.pdf)).
The eligible area becomes total area × CSP, not the cadastral surface.

The CSP 2023 coefficient is built through automatic processes using information
captured by satellites and aircraft, producing cartographies that represent
limiting factors. The core inputs are satellite imagery (including
multi-spectral HR/VHR) for identifying non-vegetated areas, terrain models for
slope, and LiDAR flights to discriminate vegetation by height and structure
([FEGA CSP note](https://www.fega.gob.es/sites/default/files/files/document/230302_nota_web_csp_2023.pdf)).
A regional technical annex describes CSP as calculated on a 5×5 m pixel grid
and then intersected with SIGPAC *recintos* to derive the eligible surface in
each pasture unit
([Extremadura CSP annex](https://www.juntaex.es/documents/77055/1878068/ANEXO%2BCOEFICIENTE%2BSUBVENCIONALIDAD%2BDE%2BPASTOS%2B%28CSP%29.pdf/fc1dc941-4203-dd13-14c3-60d389c7fd76?t=1699968238972)).

Two consequences follow. First, errors are now discussed as numbers, not as
lines on the map: the boundary of the *recinto* can be correct while the
coefficient reduces the eligible surface inside it. Contesting the error means
contesting how pixels were classified — rock versus bare soil, shrub versus
pasture, tree structure versus canopy gap — rather than where the polygon sits.
Second, the coefficient incorporates a "species factor" (*factor especie*) that
weights the vegetation factor according to local ecological conditions
([Extremadura CSP annex](https://www.juntaex.es/documents/77055/1878068/ANEXO%2BCOEFICIENTE%2BSUBVENCIONALIDAD%2BDE%2BPASTOS%2B%28CSP%29.pdf/fc1dc941-4203-dd13-14c3-60d389c7fd76?t=1699968238972)).
A pasture with scattered trees or scrub may be treated as partly ineligible on
paper, even when it is grazed in full. CSP is not just "what the satellite saw,"
but how institutions decide to treat what it saw.

## How the Classification Became a Liability

The responsibility allocation is explicit. FEGA
[frames](https://www.fega.gob.es/es/pepac-2023-2027/sistemas-gestion-y-control/sigpac)
the beneficiary as the "ultimate" responsible party for ensuring that the SIGPAC
information used in the application matches reality, and
[directs](https://www.fega.gob.es/es/content/%C2%BFc%C3%B3mo-se-debe-actuar-ante-un-error-de-la-informaci%C3%B3n-o-la-delimitaci%C3%B3n-de-un-recinto-del)
discrepancies into the allegation procedure. *Real Decreto 1048/2022* — the
royal decree establishing rules for applying CAP strategic plan interventions in
Spain — [states](https://www.boe.es/buscar/act.php?id=BOE-A-2022-23048) that the
farmer must verify that the CSP assigned to their parcels corresponds to the
land's reality. The system produces an official surface, then instructs the
beneficiary to treat that surface as something they must continuously verify,
correct, and document against.

The Supreme Court ruling of July 2025
([STS 3761/2025, resolution 1097/2025](https://www.poderjudicial.es/search/TS/openDocument/b01b2a42354a979fa0a8778d75e36f0d/20250807))
completed this logic. It explicitly overturned the High Court of Justice of
Aragon (STSJ Aragón, sentencia 148/2022, de 17 de marzo, recurso 12/2020), which
had ruled that the farmer neither has nor can be expected to have the technical
means to determine whether the admissibility coefficient is correct, and that
the duty to maintain an accurate SIGPAC falls on the state, not the applicant.
The Aragon court had found that the farmer 'does not have, nor can be required
to have, the adequate technical means to know whether the admissibility
coefficient applied to their aid application is correct' (no tiene, ni es
exigible que lo tenga los medios técnicos adecuados) — a finding the Supreme
Court set aside.

Surface-linked subsidy systems reinforce this asymmetry by design: over-claiming
is treated as risk and triggers penalties, while under-claiming is treated as
safe. The allegation workflow does not only correct errors. It disciplines
behavior: when the map is uncertain, it is safer to accept the database's
smaller number than to contest it under deadline pressure. Farmers comply with
the map not because it is accurate, but because contesting it is more expensive
than absorbing the loss. The system governs through the cost of correction, not
the accuracy of classification.

## How the Circuit Closes

Alongside SIGPAC as a reference layer, EU control practice has moved toward
continuous satellite-based monitoring. FEGA's monitoring circular
[defines](https://www.fega.gob.es/sites/default/files/files/document/AD_Circular_40-2024_EE107303_PN_controles_monitorizacion.pdf)
a traffic-light logic — green (compliant), yellow (inconclusive),
red (non-compliant) — and sets out how follow-up evidence is requested and
assessed. The same circular
[sets](https://www.fega.gob.es/sites/default/files/files/document/AD_Circular_40-2024_EE107303_PN_controles_monitorizacion.pdf)
a general deadline for additional evidence and, for monitored interventions,
adaptation of parcels in the *Solicitud Única* up to 31 August. This is not
the SIGPAC-modification deadline as such, but it is a monitoring and evidence
window that shapes how quickly farmers must document field reality.

The result is a feedback structure. The algorithm classifies. The farmer
responds — by accepting, correcting, or adjusting their declaration. The
monitoring system re-evaluates. New flags generate new evidence demands. Each
cycle produces a new determination that the farmer must either accept or
contest.

### The Perpetual Beta

When pasture coefficients are recalculated as part of a new methodology cycle,
the baseline shifts. Extremadura's CSP annex
[introduces](https://www.juntaex.es/documents/77055/1878068/ANEXO%2BCOEFICIENTE%2BSUBVENCIONALIDAD%2BDE%2BPASTOS%2B%28CSP%29.pdf/fc1dc941-4203-dd13-14c3-60d389c7fd76?t=1699968238972)
CSP 2023 as a coordinated update effort, and FEGA
[presents](https://www.fega.gob.es/es/pepac-2023-2027/sistemas-gestion-y-control/sigpac)
it as a replacement for the prior CAP coefficient. Earlier corrections do not
necessarily revert automatically. But when the methodology changes, the baseline
shifts — and corrections made under the old system may no longer apply. What was
settled becomes unsettled. The farmer who proved the algorithm wrong last year
may need to prove it wrong again this year, against a different algorithm, using
different evidence. The map is never finished; the burden never ends.

### The Cost of Contestation

When SIGPAC does not match the field, the formal instruction is straightforward:
file an allegation with the competent body in the autonomous community where the
*recinto* sits, as FEGA
[states](https://www.fega.gob.es/es/content/%C2%BFc%C3%B3mo-se-debe-actuar-ante-un-error-de-la-informaci%C3%B3n-o-la-delimitaci%C3%B3n-de-un-recinto-del).
In practice, each allegation is a small administrative project:

-   Georeferenced photographs. For CSP-related challenges, Extremadura's
    annex
    [requires](https://www.juntaex.es/documents/77055/1878068/ANEXO%2BCOEFICIENTE%2BSUBVENCIONALIDAD%2BDE%2BPASTOS%2B%28CSP%29.pdf/fc1dc941-4203-dd13-14c3-60d389c7fd76?t=1699968238972)
    *fotografías georreferenciadas* taken with approved photo tooling (SGAapp or
    regional equivalents).

-   Technical reports. The same annex
    [describes](https://www.juntaex.es/documents/77055/1878068/ANEXO%2BCOEFICIENTE%2BSUBVENCIONALIDAD%2BDE%2BPASTOS%2B%28CSP%29.pdf/fc1dc941-4203-dd13-14c3-60d389c7fd76?t=1699968238972)
    an *informe técnico* with required minimum contents as part of requesting a
    revised coefficient.

-   Timing constraints. The Generalitat Valenciana
    [states](https://www.gva.es/es/inicio/procedimientos?id_proc=G15401) that
    requests can be submitted year-round (default effect: the following year),
    but to have effect in the current year they must be filed within the same
    deadline as aid applications.

-   Resolution lag and administrative silence. Extremadura's SIGPAC
    allegation procedure
    [lists](https://www.juntaex.es/w/5698?inheritRedirect=true) a six-month
    resolution period and specifies *silencio administrativo desestimatorio* —
    if the administration does not respond within six months, the request is
    deemed denied.

Each allegation requires comfort with portals, layers, and basic GIS logic;
access to approved photo apps capable of producing georeferenced evidence
meeting quality expectations described in FEGA's monitoring guidance
([circular](https://www.fega.gob.es/sites/default/files/files/document/AD_Circular_40-2024_EE107303_PN_controles_monitorizacion.pdf));
understanding of CSP component factors; and, in some cases, a paid technical
report. For large operations, this is overhead. For small farmers, the value of
correcting the map may be lower than the cost of doing the correction properly.
The practical consequence during application season is a familiar dilemma:
declare what the database says (accepting a potentially lower payment), or
declare what you actually farm (risking a mismatch against the official layer,
with the Supreme Court having confirmed who bears the risk).
