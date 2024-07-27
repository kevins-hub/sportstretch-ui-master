import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

function TermsAndConditions() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>
          THESE TERMS OF USE (THESE "TERMS") ESTABLISH THE TERMS AND CONDITIONS
          THAT APPLY TO YOU WHEN YOU USE THE SERVICE (AS DEFINED BELOW), WHICH
          IS MADE AVAILABLE TO YOU BY SPORTSTRETCH USA, INC. ("SPORTSTRETCH", "WE", "OUR",
          OR "US") AND ITS AFFILIATES.
        </Text>
        <Text style={styles.paragraph}>
          BY USING THE SERVICE, YOU INDICATE YOUR ACCEPTANCE OF THESE TERMS AND
          YOUR AGREEMENT TO BE BOUND BY THESE TERMS, AS WELL AS ALL APPLICABLE
          LAWS AND REGULATIONS. YOU ARE NOT PERMITTED TO USE THE SERVICE IF YOU
          DO NOT AGREE TO THESE TERMS. THESE TERMS CAN BE CHANGED, MODIFIED,
          SUPPLEMENTED, AND/OR UPDATED BY SPORTSTRETCH AT ANY TIME; PROVIDED THAT WE
          WILL ENDEAVOR TO PROVIDE YOU WITH PRIOR NOTICE OF ANY MATERIAL
          CHANGES. YOUR CONTINUED USE OF THE SERVICE AFTER THE MODIFICATION OF
          THESE TERMS MEANS THAT YOU ACCEPT ALL SUCH CHANGES. ACCORDINGLY, YOU
          ARE ADVISED TO CONSULT THESE TERMS EACH TIME YOU ACCESS THE SERVICE IN
          ORDER TO VIEW ANY CHANGES TO THESE TERMS. THESE TERMS WERE LAST
          MODIFIED AS OF THE DATE INDICATED ABOVE.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>
          AS FURTHER DESCRIBED BELOW, THESE TERMS REQUIRE THE USE OF ARBITRATION
          ON AN INDIVIDUAL BASIS TO RESOLVE DISPUTES, RATHER THAN JURY TRIALS OR
          CLASS ACTIONS, AND ALSO LIMITS THE REMEDIES AVAILABLE TO YOU IN THE
          EVENT OF A DISPUTE.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.paragraph}>
          As described in Section 5(g) below, SPORTSTRETCH will not refund you for any
          reason if you receive a Treatment or Medical Treatment (as each is
          defined below), except as determined in its sole discretion. For
          avoidance of doubt, if you engage in conduct deemed inappropriate or
          unsafe by a Provider, as determined in the Provider's sole discretion,
          including, but not limited to, making inappropriate requests, engaging
          in inappropriate behavior, including inappropriate touching, or the
          Provider perceives a threat to his/her safety or well-being, and such
          conduct results in a Provider ending the Treatment or Medical
          Treatment prior to the end of the allotted time, SPORTSTRETCH will not refund
          you.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>
          Use of Web Site, Mobile Applications, and our Service
        </Text>
        <Text style={styles.paragraph}>
          a. The "Service" is SPORTSTRETCH's website located at www.SPORTSTRETCH.com and mobile
          applications, as each may be updated, relocated, or otherwise modified
          from time to time, including through networks, embeddable widgets,
          downloadable software, and tablet computer applications, and all
          intellectual property contained therein. The Service provides health
          and wellness professionals ("Providers") with a network (the "SPORTSTRETCH
          Network") through which Providers can provide Treatments (each, a
          "Treatment") to consumers, whether in-person or virtually, meaning
          utilizing a video communications platform. Any person who accesses
          and/or uses the Service to book a Treatment on his or her own behalf,
          or on behalf of any third party, will be referred to herein as a "SPORTSTRETCH
          Member". Additionally, the Service provides consumers with the
          opportunity to (a) order testing services designed to detect the
          COVID-19 virus or antibodies, through a PCR test or a blood test, with
          nasal swab sample taken or blood draw administered by a registered
          nurse or licensed practical nurse in your home (each a "COVID-19
          Test") and (b) access to (i) physicians or other qualified healthcare
          professionals who can order such Covid-19 Test on your behalf and
          discuss such COVID-19 Test results virtually through consultation
          appointments, (ii) massage therapists who can provide medical
          massages; and/or (iii) other health care professionals who can provide
          other medical services that SPORTSTRETCH may make available from time to time
          ("Medical Treatments") (collectively, (a) and (b), referred to herein
          as "Telehealth Service" or "Telehealth Services"). Certain of the
          terms and conditions in these Terms apply only to the Telehealth
          Services (or certain Telehealth Services), and not to the SPORTSTRETCH
          Network. Those terms and conditions are set forth in Section 9 below.
        </Text>
        <Text style={styles.paragraph}>
          PLEASE NOTE THAT THE SERVICES, INCLUDING THE TELEHEALTH SERVICE, ARE
          NOT INTENDED FOR MEDICAL EMERGENCIES. IF YOU ARE EXPERIENCING A
          MEDICAL EMERGENCY, YOU SHOULD DIAL "911" IMMEDIATELY.
        </Text>
      </View>

      {/* Additional sections here */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default TermsAndConditions;
