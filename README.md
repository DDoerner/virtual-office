# WŌRK
### We're making remote teams feel close. It's the small interactions that make a workplace feel like a community and we help bringing your virtual company space to your home office.

With WŌRK you can stay connected with your friends and colleagues at work no matter where you are.

---
<div style="margin-top: 20px"></div>

## PROBLEM
The COVID-19 pandemic wreaks havoc among how we as human beings connect, interact and work together. We're not only disconnected from our loved ones, but especially distributed virtual teams suffer from a lack of human contact and connection. So much of a healthy social life and a good work climate depends on small talk, coffee breaks with one another, knowing what the colleagues are working on and seeing that there are other people around oneself working towards the same goal. As such we're not looking for more efficiency, but more humanity when workers cannot meet in person. 

---
<div style="margin-top: 20px"></div>

## WŌRK
Real interactions are seldom forced. They happen spontaneously, out of curiousity and without much planning. That is why **WŌRK graphically virtualizes the office space and the workers within it** and gives you the information you would have had on-premise. You see that Susan takes a coffee break, maybe you can join her. Martin is working on the Clifford deal, you could check in on how he's doing. Kim is on the phone, again, but it's good to see that sales are coming along. 

WŌRK accompanies each team member and displays what they are doing at the moment. WŌRK offers to **connect with short and spontaneous voice or video calls**, without the need to schedule anything or pick an agenda. **WŌRK protects your privacy**, so that you can approximately know what is going on without feeling like you're spied on 24/7. And last but not least WŌRK gives you **the feeling of being part of a bustling team**, even when everyone is by themselves and far apart.

![Citation](https://raw.githubusercontent.com/DDoerner/virtual-office/master/images/citation_NEW.png)

---
<div style="margin-top: 20px"></div>

## HOW DOES IT WŌRK?
Creating a virtual office is literally as simple as one click. You create an anonymous room and can then invite your team members, while the office space automatically expands as more members join. We are using **deep learning to automatically infer four different classes of activities** from your webcam feed: **working, telephony, eating and absence**. The different states are then reflected in the graphical virtual office to raise awareness within your team and help to create a natural feeling of community. Most importantly though, you do not have to worry about sharing your video stream continuously as **all your activities are represented by your virtual avatar** _**AUTOMAGICALLY**_.  

<HTML>
<div width="100%">
<centering>
<img width="100%" src="https://raw.githubusercontent.com/DDoerner/virtual-office/master/images/office.gif">
</centering>
</div>
</html>

WŌRK establishes encrypted peer-to-peer connections between all team members to share the virtual office environment. No manual interactions are required, although they are possible. Instead **automatic recognition via audio and video** takes place to assess your current activity, which is then broadcasted to the rest of your team and displayed visually. We are using **on-device machine learning and a purely web-based solution** for activity recognition, so video data never leaves your device and no account or installation is necessary. Even video calls are transferred solely via end-to-end-encrypted peer-to-peer telephony -- preserving both your privacy and sensitive work-related information.


![MACHINE LEARNING](https://raw.githubusercontent.com/DDoerner/virtual-office/master/images/SCIENCY_NEW.png?raw=true)

---
<div style="margin-top: 20px"></div>

## VISION
WŌRK can already help so much to make teams feel closer to one another but we feel that there is a lot more we can tackle. We want to help new team members get to know their colleagues better and feel included, or also support the sharing and managing of knowledge between workers in the office. Ultimately, we crave social bonds and for this reason we want to **build a platform that acts and feels just like the real thing**.

---
<div style="margin-top: 20px"></div>

## How We built WŌRK

WŌRK is completely web-based and relies on latest cutting-edge technologies and frameworks.

The client is an **Ionic-Angular web app** that connects to the other clients in a peer-to-peer fashion via **web sockets using the WebRTC standard**. While a server exists, implemented with **Azure Functions**, is only acts as a broker to help clients find one another via anonymous rooms ("virtual offices").

Each client can freely join and create rooms and change their identity as they please. Rooms however can only be joined if the invite code is known, which is distributed by the creator. Once clients join a room, they are notified of all current participants and establish **P2P connections** to each one of them. From no on, all interactions happen purely between participants without interaction with a third party.

The clients then start to analyze the behavior of their owner via the **TensorFlow framework for artifical intelligence** to analyze the video stream from the web or front camera. The models are evaluated solely on the client and results and then broadcasted to all active connections, which each then update their virtual office model. This model is represented in a 2D virtual office space implemented in the **HTML5 game framework Phaser**, where each participant is represented by an avatar that mimickes their activities continuously.

Similarly, voice and video calls can be requested and executed in an encrypted P2P fashion via the same connections.

![techstack](https://raw.githubusercontent.com/DDoerner/virtual-office/master/images/logos.PNG)

---
<div style="margin-top: 20px"></div>

## Challenges We ran into

* **Combining the technologies**.
We focused on three major technologies that we didn't have too much experience with beforehand: activity recognition via machine learning, P2P communication via WebRTC and graphical depictions using a game engine. We split up the technologies between the three of us and spent the first half of the hackathon only working on our respective parts before we were first able to combine the technologies.

* **Balance between privacy and legitimate interest**.
At first glance our project can seem like a violation of privacy, as workers don't want to be watched 24/7. So we needed to decide on a balance that on one hand does not offer much more information that one would have in an office (like for example knowing that someone is in a call, but not with whom) but on the other side offer enough information that it is useful for the users.

* **Working as a hybrid team**.
It was the first time for all of us to participate in a hackathon as a hybrid team of on-premise and remote team members. We were connected to one another for probably 80% of the whole hackathon and learned a lot about what works and what doesn't when discussing aspects of the project or working by ourselves.

---
<div style="margin-top: 20px"></div>

## Accomplishments that We are proud of
We have a 100% working prototype. This first version is publicly hosted and could be demo'ed with everyone that wants to. That means that in the demos we show both in this project description and the accompanied video, no data or functionality is mocked and is instead created with real clients. 

---
<div style="margin-top: 20px"></div>

## What's next for WŌRK

If you read up to this point, you must be really interested in the project. We appreciate you taking the time to look into what we have done. To stay up to date about WORK feel free to follow our social media channels [@TobiasRoeddiger](https://twitter.com/TobiasRoeddiger).
