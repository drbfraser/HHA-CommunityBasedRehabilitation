import React from "react";
import Grid from "@material-ui/core/Grid";
import AlertList from "./AlertList";
import {makeStyles} from "@material-ui/core/styles";
import Divider from '@mui/material/Divider';

const useStyles = makeStyles({
  testItemStyle1: {
    backgroundColor: "green",
  },
  testItemStyle2: {
    backgroundColor: "yellow",
  },
  gridStyle: {
    borderStyle: "solid",
    borderColor: "pink",
  },
  dividerStyle: {
    backgroundColor: "black",
    
  }
});

const AlertInbox = () => {
  const style = useStyles();
  return  (
    <Grid container justify="center" alignItems="flex-start" spacing={3}>
      <AlertList />
      {/* <Divider orientation="vertical" /> */}
      <Grid item xs={9} md={9}  
        // className={style.gridStyle}
      >
          <h1 
            // className={style.testItemStyle1}
          >
            Message
          </h1>

          <Divider
            variant="fullWidth"
            className={style.dividerStyle}
          />
          <h2
            // className={style.testItemStyle2}
          >
            Message Name
          </h2>
          <p>
            Google LLC is an American multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, a search engine, cloud computing, software, and hardware. 
            <br/><br/>
            It is considered one of the Big Five companies in the American information technology industry, along with Amazon, Facebook, Apple, and Microsoft.[9][10][11] Google was founded on September 4, 1998, by Larry Page and Sergey Brin while they were Ph.D. students at Stanford University in California. 
            <br/><br/>
            Together they own about 14% of its publicly-listed shares and control 56% of the stockholder voting power through super-voting stock. The company went public via an initial public offering (IPO) in 2004. In 2015, Google was reorganized as a wholly-owned subsidiary of Alphabet Inc.. Google is Alphabet's largest subsidiary and is a holding company for Alphabet's Internet properties and interests. 
            <br/><br/>
            Sundar Pichai was appointed CEO of Google on October 24, 2015, replacing Larry Page, who became the CEO of Alphabet. On December 3, 2019, Pichai also became the CEO of Alphabet.[12] 
            <br/><br/>
            In 2021, the Alphabet Workers Union was founded, mainly composed of Google employees.[13] The company's rapid growth since incorporation has included products, acquisitions, and partnerships beyond Google's core search engine, (Google Search). It offers services designed for work and productivity (Google Docs, Google Sheets, and Google Slides), email (Gmail), scheduling and time management (Google Calendar), cloud storage (Google Drive), instant messaging and video chat (Google Duo, Google Chat, and Google Meet), language translation (Google Translate), mapping and navigation (Google Maps, Waze, Google Earth, and Street View), podcast hosting (Google Podcasts), video sharing (YouTube), blog publishing (Blogger), note-taking (Google Keep and Jamboard), and photo organizing and editing (Google Photos). 
            <br/><br/>
            The company leads the development of the Android mobile operating system, the Google Chrome web browser, and Chrome OS (a lightweight, proprietary operating system based on the free and open-source Chromium OS operating system). Google has moved increasingly into hardware; from 2010 to 2015, it partnered with major electronics manufacturers in the production of its Google Nexus devices, and it released multiple hardware products in 2016, including the Google Pixel line of smartphones, Google Home smart speaker, Google Wifi mesh wireless router. Google has also experimented with becoming an Internet carrier (Google Fiber and Google Fi). Google.com is the most visited website worldwide. Several other Google-owned websites also are on the list of most popular websites, including YouTube and Blogger.[14] On the list of most valuable brands, Google is ranked second by Forbes[15] and fourth by Interbrand.[16] It has received significant criticism involving issues such as privacy concerns, tax avoidance, censorship, search neutrality, antitrust and abuse of its monopoly position.
          </p>
      </Grid>
    </Grid>
  );
}

export default AlertInbox;