/**
 * Resume/CV template created with Bootstrap 5 by @vmoratog and @jdnichollsc
 */
 const resume = {
    firstName: "Minuth",
    lastName: "Prom",
    jobTitle: "Software Engineer",
    city: "Kandal Province, Krong Tah Khmau",
    country: "Cambodia",
    phone: "+855966203288",
    email: "minuthprom321@gmail.com",
    education: [
      {
        school: "Royal University Of Phnom Penh",
        degree: "Bachelor",
        graduationDate: "2016-2019",
        description: "Computer Science"
      },
      {
        school: "Korean Software HRD Center",
        degree: "Scholarship Program",
        graduationDate: "2018-2019",
        description: "Software Development"
      },
      {
        school: "ANT Computer Specialist Training",
        degree: "",
        graduationDate: "2016-2017",
        description: "Software Development"
      }
    ],
    links: [
      {
        label: "GitHub",
        link: "https://github.com/minuth"
      },
      {
        label: "LinkedIn",
        link: "https://linkedin.com/in/minuthp/"
      },
      {
        label: "Telegram",
        link: "https://t.me/minuthp"
      }
    ],
    skills: [
      "Java (Spring boot)",
      "JavaScript/TypeScript-Backend[ExpressJS, NestJS]",
      "JavaScript/TypeScript-Frontend[NextJS, NuxtJS]",
      "Android (Java, Kotlin)",
      "C#",
      "PostgreSQL",
      "Docker",
      "CI/CD(Github Action)",
      "AWS/GCP"
    ],
    languages: ["Khmer", "English"],
    professionalSummary: `Developer with a background in web and mobile, having 4 years of practice experiences.`,
    employmentHistory: [
      {
        jobTitle: "Senior Core System Developer",
        startDate: "November 2022",
        endDate: "Present",
        employer: "PiPay",
        city: "Phnom Penh",
        achievements: [
          {
            projectName: "PiPay ECommerce Portal",
            description:
              "The Payment gateway for merchant to integrate PiPay online payment with their online shop.",
            responsibility:
              "Refactored project structure and technology both front-end and back-end, and improve deployment process."
          },
          {
            projectName: "PiPay Core System",
            description: "The core system that provide API for PiPay mobile application",
            responsibility:
              "Maintenance and develop new API, and integrate with others payment gateway."
          }
        ]
      },
      {
        jobTitle: "Full-Stack Developer",
        startDate: "May 2021",
        endDate: "November 2022",
        employer: "VTECH CO., LTD",
        city: "Phnom Penh",
        achievements: [
          {
            projectName: "CM2H",
            description:
              "The Cambodia My 2nd Home (CM2H) is the only government official program approved and recognized by the Ministry of Interior and General Department of Immigration of the Kingdom of Cambodia to allow foreigners to stay in Cambodia with a Golden Visa of 10 years.",
            responsibility:
              "Structure project and analyst database, build REST API for front-end, integrate API with Admin Panel, and implement CI/CD for docker deployment."
          },
          {
            projectName: "Experts",
            description: "The web trading platform based on Crypto and FOREX.",
            responsibility:
              "Build REST API for front-end, integrate API with Admin Panel, integrate online payment for top-up option and worked with socket.io to provide the real-time data of stock price and other action from the admin panel."
          },
          {
            projectName: "WhatApp Automation",
            description:
              "The automation WhatsApp application to create an account and send messages",
            responsibility:
              "Using ADB tool and Node.JS to automation the WhatsApp application."
          }
        ]
      },
      {
        jobTitle: "Software Engineer",
        startDate: "July 2019",
        endDate: "May 2021",
        employer: "Metfone",
        city: "Phnom Penh",
        achievements: [
          {
            projectName: "eMoney",
            description:
              "A mobile finance provider for users to transfer money, bill payment, phone topup...",
            responsibility:
              "Develop and maintenance Android app using Kotlin, RxAndroid, Retrofit and Firebase"
          },
          {
            projectName: "eMoney Agent",
            description:
              "A mobile application for agent to provide money transaction service for the customer with suitable commission.",
            responsibility:
              "Develop and maintenance Android app using Kotlin, RxAndroid, Retrofit and Firebase, and connect application to the POS printer."
          },
          {
            projectName: "CamID",
            description:
              "An entertainment application for mobile that it allows users to watch movies for free, live stream, chat,... and using other Metfone services.",
            responsibility:
              "Optimize app size, and develop and maintenance Android app using Java, Retrofit, EventBus and Firebase."
          },
          {
            projectName: "mDealer",
            description: "A mobile application for Metfone dealer.",
            responsibility:
              "Implement whole UI of new redesign and maintenance of Android application."
          }
        ]
      },
      {
        jobTitle: "Android Developer",
        startDate: "April 2019",
        endDate: "July 2019",
        employer: "MobileOne",
        city: "Phnom Penh"
      },
      {
        jobTitle: "Programming Teacher (Part-time)",
        startDate: "2019",
        endDate: "2021",
        employer: "ANT Computer Specialist Training",
        city: "Phnom Penh"
      },
      {
        jobTitle: "Volunteer Programmer Assistant",
        startDate: "2017",
        endDate: "2018",
        employer: "ANT Computer Specialist Training",
        city: "Phnom Penh"
      }
    ],
    photo:
      "https://avatars.githubusercontent.com/u/33181465?v=4"
  };
  
  const formatResume = (r) => ({
    ...r,
    address: [r.country, r.city, r.postalCode].filter(Boolean).join(", ")
  });
  
  new Vue({
    el: "#app",
    data: formatResume(resume)
  });
  
  /**
   * Wait for animatable-component to be loaded (Only for VanillaJS)
   **/
  function animatableLoaded() {
    document.querySelector("body").classList.remove("d-none");
  }
  if (customElements) {
    customElements.whenDefined("animatable-component").then(animatableLoaded);
  } else animatableLoaded();
  
