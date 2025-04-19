# PROV_PRIMER

## Crawl Summary
This technical document details the PROV data model with specific implementation examples in Turtle, PROV-N, and XML. It provides exact syntax for declaring entities, activities, agents (including roles and responsibilities), usage and generation relationships, derivation and revision logic, as well as plans and time annotations using xsd:dateTime. The document specifies precise RDF triples, PROV-N statements with optional argument placeholders (denoted by '-') and equivalent XML schema elements. It also covers best practices for linking provenance records with explicit role assignments and qualified associations.

## Normalised Extract
Table of Contents:
1. PROV Introduction
   - Overview: Defines a provenance model for representing origins of data.
2. Entities
   - Technical Detail: Entities are declared using 'prov:Entity' with attributes (e.g. dcterms:title).
   - Examples:
     * Turtle:
       exn:article a prov:Entity ;
                dcterms:title "Crime rises in cities" .
     * PROV-N:
       entity(exn:article, [dcterms:title="Crime rises in cities"])
     * XML:
       <prov:entity prov:id="exn:article">
         <dct:title>Crime rises in cities</dct:title>
       </prov:entity>
3. Activities
   - Technical Detail: Declared with 'prov:Activity'; used for processes that generate or use entities.
   - Examples:
     * Turtle: exc:compile1 a prov:Activity .
     * PROV-N: activity(exc:compile1)
     * XML: <prov:activity prov:id="exc:compile1"/>
4. Usage and Generation
   - Technical Detail: Use of 'prov:used' and 'prov:wasGeneratedBy' to relate entities and activities.
   - Examples:
     * Turtle:
       exc:compose1 prov:used exg:dataset1 ;
                   prov:used exc:regionList1 .
       exc:composition1 prov:wasGeneratedBy exc:compose1 .
     * PROV-N:
       used(exc:compose1, exg:dataset1, -)
       used(exc:compose1, exc:regionList1, -)
       wasGeneratedBy(exc:composition1, exc:compose1, -)
     * XML:
       <prov:used>
         <prov:activity prov:ref="exc:compose1"/>
         <prov:entity prov:ref="exg:dataset1"/>
       </prov:used>
       <prov:used>
         <prov:activity prov:ref="exc:compose1"/>
         <prov:entity prov:ref="exc:regionList1"/>
       </prov:used>
       <prov:wasGeneratedBy>
         <prov:entity prov:ref="exc:composition1"/>
         <prov:activity prov:ref="exc:compose1"/>
       </prov:wasGeneratedBy>
5. Agents and Responsibility
   - Technical Detail: Agents are defined with 'prov:Agent'; subtypes specify Person, Organization, etc.
   - Examples:
     * Turtle:
       exc:derek a prov:Agent , prov:Person ;
               foaf:givenName "Derek" ;
               foaf:mbox <mailto:derek@example.org> .
     * PROV-N:
       agent(exc:derek, [prov:type='prov:Person', foaf:givenName="Derek", foaf:mbox="<mailto:derek@example.org>"])
     * XML:
       <prov:agent prov:id="exc:derek">
         <prov:type>prov:Person</prov:type>
         <foaf:givenName>Derek</foaf:givenName>
         <foaf:mbox>mailto:derek@example.org</foaf:mbox>
       </prov:agent>
6. Roles and Qualified Associations
   - Technical Detail: Roles are declared via 'prov:hadRole'; qualified usage/generation add further details.
   - Examples:
     * Turtle:
       exc:compose1 prov:qualifiedUsage [
         a prov:Usage ;
         prov:entity  exg:dataset1 ;
         prov:hadRole exc:dataToCompose
       ] .
     * PROV-N:
       used(exc:compose1, exg:dataset1, -, [prov:role='exc:dataToCompose'])
     * XML:
       <prov:used>
         <prov:activity prov:ref="exc:compose1"/>
         <prov:entity prov:ref="exg:dataset1"/>
         <prov:role>exc:dataToCompose</prov:role>
       </prov:used>
7. Derivation and Revision
   - Technical Detail: Use 'prov:wasRevisionOf' and 'prov:wasDerivedFrom' to link revisions.
   - Examples:
     * Turtle:
       exg:dataset2 a prov:Entity ;
                prov:wasRevisionOf exg:dataset1 .
     * PROV-N:
       wasDerivedFrom(exc:chart2, exc:chart1, [prov:type='prov:Revision'])
     * XML:
       <prov:wasDerivedFrom>
         <prov:generatedEntity prov:ref="exc:chart2"/>
         <prov:usedEntity prov:ref="exc:chart1"/>
         <prov:type>prov:Revision</prov:type>
       </prov:wasDerivedFrom>
8. Plans and Time
   - Technical Detail: Activities and associations can include time data; use xsd:dateTime format.
   - Examples:
     * Turtle:
       exg:correct1 prov:startedAtTime "2012-03-31T09:21:00"^^xsd:dateTime ;
                prov:endedAtTime "2012-04-01T15:21:00"^^xsd:dateTime .
     * PROV-N:
       activity(exg:correct1, 2012-03-31T09:21:00, 2012-04-01T15:21:00)
     * XML:
       <prov:activity prov:id="exg:correct1">
         <prov:startTime>2012-03-31T09:21:00</prov:startTime>
         <prov:endTime>2012-04-01T15:21:00</prov:endTime>
       </prov:activity>
9. Alternate Entities and Specialization
   - Technical Detail: Link multiple perspectives using qualifiers such as 'prov:wasQuotedFrom'.
   - Examples:
     * Turtle:
       exb:quoteInBlogEntry-20130326 a prov:Entity ;
         prov:value "Smaller cities have more crime than larger ones" ;
         prov:wasQuotedFrom exn:article .
     * PROV-N:
       entity(exb:quoteInBlogEntry-20130326, prov:value="Smaller cities have more crime than larger ones")


## Supplementary Details
PROV Technical Specifications and Implementation Details:
- **Entities:**
  - Must be declared as 'prov:Entity'. Attributes (e.g., dcterms:title) are added for metadata.
- **Activities:**
  - Declared using 'prov:Activity'. Usage relationships are detailed with 'prov:used' and outputs with 'prov:wasGeneratedBy'.
- **Agents:**
  - Declared as 'prov:Agent'. Sub-types include 'prov:Person' and 'prov:Organization'. A typical declaration includes FOAF properties as seen in the examples.
- **Roles and Qualified Associations:**
  - Express roles via 'prov:hadRole'. Qualified associations are implemented via nested structures in Turtle, additional parameters in PROV-N, and child elements in XML.
- **Time and DateTime:**
  - Use xsd:dateTime (e.g., "2012-03-31T09:21:00"^^xsd:dateTime) for timestamping activities.
- **Plans:**
  - Declared as 'prov:Plan' and linked via 'prov:hadPlan' in both PROV-O and XML.

Implementation Steps:
1. Define namespace prefixes explicitly. Example:
   @prefix prov: <http://www.w3.org/ns/prov#> .
   @prefix dcterms: <http://purl.org/dc/terms/> .
   @prefix foaf: <http://xmlns.com/foaf/0.1/> .
2. Declare entities, activities, and agents following the provided examples.
3. Use qualified usage/generation constructs to attach roles and additional metadata.
4. Validate documents using respective validators (RDF validators for Turtle, xmllint for XML, and syntax checkers for PROV-N).

Configuration Options:
- Namespace prefixes (exn, exg, exc, exb) must be defined according to their data sources (e.g., newspaper, government, chart generator, blog).
- Time attributes require strict adherence to xsd:dateTime format.

Best Practices:
- Always include explicit types and role assignments.
- Link revisions using 'prov:wasRevisionOf' to maintain historical data lineage.
- Validate provenance documents against the PROV-DM and PROV-XML schemas.

Troubleshooting Procedures:
- For XML: Run `xmllint --schema prov.xsd file.xml` and expect a valid XML output.
- For Turtle: Use an RDF validator (e.g., `rapper -g file.ttl`) to ensure correct triple syntax.
- For PROV-N: Compare statements against the official PROV-N specification and check for missing optional parameters (denoted by '-').


## Reference Details
Complete API Specifications, SDK Method Signatures and Code Examples:

1. PROV-O / PROV-DM Functions (Pseudocode):
   - used(activity: string, entity: string, time?: string, attributes?: object): void
     * Parameters:
       - activity (string): The identifier of the activity.
       - entity (string): The identifier of the used entity.
       - time (optional string): The timestamp (xsd:dateTime) when the usage occurred.
       - attributes (optional object): Map of additional attributes (e.g., {prov:role: 'roleValue'}).
     * Example (PROV-N):
       used(exc:compose1, exg:dataset1, -, [prov:role='exc:dataToCompose'])

   - wasGeneratedBy(entity: string, activity: string, time?: string, attributes?: object): void
     * Parameters:
       - entity (string): The identifier of the generated entity.
       - activity (string): The identifier of the activity that generated the entity.
       - time (optional string): The generation timestamp.
       - attributes (optional object): Additional properties (e.g., {prov:role: 'generatedData'}).
     * Example (PROV-N):
       wasGeneratedBy(exc:composition1, exc:compose1, -)

   - wasAssociatedWith(activity: string, agent: string, time?: string, attributes?: object): void
     * Parameters:
       - activity (string): The identifier of the activity.
       - agent (string): The identifier of the associated agent.
       - time (optional string): Timestamp of association.
       - attributes (optional object): Additional attributes (e.g., {prov:role: 'analyst'}).
     * Example (PROV-N):
       wasAssociatedWith(exc:compose1, exc:derek, -, [prov:role='exc:analyst'])

2. Full Code Examples:
   - **Turtle Format Example:**
     ```turtle
     @prefix prov: <http://www.w3.org/ns/prov#> .
     @prefix dcterms: <http://purl.org/dc/terms/> .
     @prefix foaf: <http://xmlns.com/foaf/0.1/> .

     exn:article a prov:Entity ;
              dcterms:title "Crime rises in cities" .
     
     exc:compile1 a prov:Activity .

     exc:compose1 prov:qualifiedUsage [
         a prov:Usage ;
         prov:entity  exg:dataset1 ;
         prov:hadRole exc:dataToCompose
     ] .

     exg:dataset2 a prov:Entity ;
              prov:wasRevisionOf exg:dataset1 .
     ```

   - **PROV-N Format Example:**
     ```provn
     entity(exn:article, [dcterms:title="Crime rises in cities"])
     activity(exc:compile1)
     used(exc:compose1, exg:dataset1, -, [prov:role='exc:dataToCompose'])
     wasDerivedFrom(exc:chart2, exc:chart1, [prov:type='prov:Revision'])
     ```

   - **XML Format Example:**
     ```xml
     <prov:document xmlns:prov="http://www.w3.org/ns/prov#" 
                     xmlns:dct="http://purl.org/dc/terms/" 
                     xmlns:foaf="http://xmlns.com/foaf/0.1/">
       <prov:entity prov:id="exn:article">
         <dct:title>Crime rises in cities</dct:title>
       </prov:entity>
       <prov:activity prov:id="exc:compile1"/>
       <prov:used>
         <prov:activity prov:ref="exc:compose1"/>
         <prov:entity prov:ref="exg:dataset1"/>
         <prov:role>exc:dataToCompose</prov:role>
       </prov:used>
       <prov:wasDerivedFrom>
         <prov:generatedEntity prov:ref="exc:chart2"/>
         <prov:usedEntity prov:ref="exc:chart1"/>
         <prov:type>prov:Revision</prov:type>
       </prov:wasDerivedFrom>
     </prov:document>
     ```

3. Configuration Options:
   - **Namespaces:** Must be defined in each document. Example:
       @prefix prov: <http://www.w3.org/ns/prov#> .
       @prefix dcterms: <http://purl.org/dc/terms/> .
       @prefix foaf: <http://xmlns.com/foaf/0.1/> .

4. Best Practices:
   - Explicitly declare roles and time attributes to ensure complete provenance.
   - Validate each document using appropriate schema validators: RDF/Turtle validators, xmllint for XML, and syntax checkers for PROV-N.

5. Troubleshooting Procedures:
   - **XML Validation:** 
       Command: `xmllint --schema prov.xsd file.xml`
       Expected Output: XML document validates successfully against the PROV schema.
   - **RDF Validation:** 
       Command: `rapper -g file.ttl`
       Expected Output: Valid RDF triples with no errors.
   - **PROV-N Validation:** 
       Compare against official PROV-N specification; ensure use of '-' for unspecified optional fields.


## Original Source
PROV Primer
https://www.w3.org/TR/prov-primer/

## Digest of PROV_PRIMER

# PROV PRIMER

This document was retrieved on 2023-10-26 and contains the complete technical details of the PROV data model as described by W3C. It includes the exact specifications for entities, activities, agents, roles, qualified relationships, derivation, revision, plans, and time annotations in three representation formats: Turtle, PROV-N, and XML.

## Entities
- **Definition:** A physical, digital, conceptual, or other object whose provenance is tracked.
- **Turtle Example:**
  ```turtle
  exn:article a prov:Entity ;
           dcterms:title "Crime rises in cities" .
  ```
- **PROV-N Example:**
  ```provn
  entity(exn:article, [dcterms:title="Crime rises in cities"])
  ```
- **XML Example:**
  ```xml
  <prov:entity prov:id="exn:article">
    <dct:title>Crime rises in cities</dct:title>
  </prov:entity>
  ```

## Activities
- **Definition:** A process or action that generates or uses entities.
- **Turtle Example:**
  ```turtle
  exc:compile1 a prov:Activity .
  ```
- **PROV-N Example:**
  ```provn
  activity(exc:compile1)
  ```
- **XML Example:**
  ```xml
  <prov:activity prov:id="exc:compile1"/>
  ```

## Usage and Generation
- **Specification:** Linking entities with activities using relationships such as `prov:used` and `prov:wasGeneratedBy`.
- **Turtle Example:**
  ```turtle
  exc:compose1 prov:used exg:dataset1 ;
               prov:used exc:regionList1 .
  exc:composition1 prov:wasGeneratedBy exc:compose1 .
  ```
- **PROV-N Example:**
  ```provn
  used(exc:compose1, exg:dataset1, -)
  used(exc:compose1, exc:regionList1, -)
  wasGeneratedBy(exc:composition1, exc:compose1, -)
  ```
- **XML Example:**
  ```xml
  <prov:used>
    <prov:activity prov:ref="exc:compose1"/>
    <prov:entity prov:ref="exg:dataset1"/>
  </prov:used>
  <prov:used>
    <prov:activity prov:ref="exc:compose1"/>
    <prov:entity prov:ref="exc:regionList1"/>
  </prov:used>
  <prov:wasGeneratedBy>
    <prov:entity prov:ref="exc:composition1"/>
    <prov:activity prov:ref="exc:compose1"/>
  </prov:wasGeneratedBy>
  ```

## Agents and Responsibility
- **Definition:** Agents are responsible actors (persons, software, organizations) which participate in activities.
- **Turtle Example:**
  ```turtle
  exc:derek a prov:Agent , prov:Person ;
          foaf:givenName "Derek" ;
          foaf:mbox <mailto:derek@example.org> .
  ```
- **PROV-N Example:**
  ```provn
  agent(exc:derek, [prov:type='prov:Person', foaf:givenName="Derek", foaf:mbox="<mailto:derek@example.org>"])
  ```
- **XML Example:**
  ```xml
  <prov:agent prov:id="exc:derek">
    <prov:type>prov:Person</prov:type>
    <foaf:givenName>Derek</foaf:givenName>
    <foaf:mbox>mailto:derek@example.org</foaf:mbox>
  </prov:agent>
  ```

## Roles, Qualified Usage & Generation
- **Definition:** Roles express the function an entity or agent plays in an activity. Qualified relationships add precise detail.
- **Turtle Example:**
  ```turtle
  exc:compose1 prov:qualifiedUsage [
           a prov:Usage ;
           prov:entity  exg:dataset1 ;
           prov:hadRole exc:dataToCompose 
  ] .
  ```
- **PROV-N Example:**
  ```provn
  used(exc:compose1, exg:dataset1, -, [prov:role='exc:dataToCompose'])
  ```
- **XML Example:**
  ```xml
  <prov:used>
    <prov:activity prov:ref="exc:compose1"/>
    <prov:entity prov:ref="exg:dataset1"/>
    <prov:role>exc:dataToCompose</prov:role>
  </prov:used>
  ```

## Derivation and Revision
- **Specification:** Describes relationships where one entity derives from or revises another.
- **Turtle Example:**
  ```turtle
  exg:dataset2 a prov:Entity ;
           prov:wasRevisionOf exg:dataset1 .
  ```
- **PROV-N Example:**
  ```provn
  wasDerivedFrom(exc:chart2, exc:chart1, [prov:type='prov:Revision'])
  ```
- **XML Example:**
  ```xml
  <prov:wasDerivedFrom>
    <prov:generatedEntity prov:ref="exc:chart2"/>
    <prov:usedEntity prov:ref="exc:chart1"/>
    <prov:type>prov:Revision</prov:type>
  </prov:wasDerivedFrom>
  ```

## Plans and Time
- **Specification:** Documenting plan execution and time-stamping events using xsd:dateTime.
- **Turtle Example:**
  ```turtle
  exg:correct1 prov:startedAtTime "2012-03-31T09:21:00"^^xsd:dateTime ;
           prov:endedAtTime "2012-04-01T15:21:00"^^xsd:dateTime .
  ```
- **PROV-N Example:**
  ```provn
  activity(exg:correct1, 2012-03-31T09:21:00, 2012-04-01T15:21:00)
  ```
- **XML Example:**
  ```xml
  <prov:activity prov:id="exg:correct1">
    <prov:startTime>2012-03-31T09:21:00</prov:startTime>
    <prov:endTime>2012-04-01T15:21:00</prov:endTime>
  </prov:activity>
  ```

## Alternate Entities and Specialization
- **Definition:** Linking multiple descriptions or specializations of the same entity.
- **Turtle Example:**
  ```turtle
  exb:quoteInBlogEntry-20130326 a prov:Entity ;
                              prov:value "Smaller cities have more crime than larger ones" ;
                              prov:wasQuotedFrom exn:article .
  ```
- **PROV-N Example:**
  ```provn
  entity(exb:quoteInBlogEntry-20130326, prov:value="Smaller cities have more crime than larger ones")
  ```
- **XML Example:** (Similar structure using <prov:entity> and <prov:wasDerivedFrom> elements.)


## Attribution
- Source: PROV Primer
- URL: https://www.w3.org/TR/prov-primer/
- License: License: W3C License
- Crawl Date: 2025-04-17T17:38:23.105Z
- Data Size: 16068910 bytes
- Links Found: 29571

## Retrieved
2025-04-17
