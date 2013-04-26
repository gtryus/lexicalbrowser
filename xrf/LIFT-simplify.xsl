<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:strip-space elements="*"/>
    
    <xsl:output method="xml" indent="yes" encoding="UTF-8"/>

    <xsl:template match="lift">
        <database>
            <xsl:apply-templates select="entry[descendant::sense[relation[@type='Synonyms']]]"/>
        </database>
    </xsl:template>

    <xsl:template match="entry">
        <entry>
            <form>
                <xsl:value-of select="citation/form/text"/>
            </form>
            <xsl:apply-templates select="descendant::sense[relation[@type='Synonyms']]"/>
        </entry>
    </xsl:template>
    
    <xsl:template match="sense">
        <sense>
            <xsl:copy-of select="@id"/>
            <category>
                <xsl:value-of select="grammatical-info/@value"/>
            </category>
            <gloss>
                <xsl:value-of select="gloss[@lang='en']/text"/>
            </gloss>
            <synonyms>
                <xsl:for-each select="relation[@type='Synonyms']">
                    <ref>
                        <xsl:value-of select="@ref"/>
                    </ref>
                </xsl:for-each>
            </synonyms>
        </sense>
    </xsl:template>

</xsl:stylesheet>
