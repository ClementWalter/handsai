import React from "react";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import Hero from "components/hero/BackgroundAsImageWithCenteredContent.js";
import Features from "components/features/ThreeColWithSideImage.js";
import MainFeature from "components/features/TwoColWithButton.js";
import MainFeature2 from "components/features/TwoColWithTwoHorizontalFeaturesAndButton.js";
import FeatureWithSteps from "components/features/TwoColWithSteps.js";
import Pricing from "components/pricing/ThreePlans.js";
import Testimonial from "components/testimonials/TwoColumnWithImageAndRating.js";
import FAQ from "components/faqs/SingleCol.js";
import GetStarted from "components/cta/GetStarted";
import Footer from "components/footers/FiveColumnWithBackground.js";
import heroScreenshotImageSrc from "images/hero-screenshot-1.png";
import macHeroScreenshotImageSrc from "images/hero-screenshot-2.png";
import appMockUpSrc from "images/mockups/iterate_mockup.png";
import prototypeIllustrationImageSrc from "images/prototype-illustration.svg";
import { ReactComponent as VersatileIcon } from "feather-icons/dist/icons/code.svg";
import { ReactComponent as FreeIcon } from "feather-icons/dist/icons/dollar-sign.svg";
import { ReactComponent as ImmediateIcon } from "images/fast-icon.svg";

export default () => {
  const Subheading = tw.span`uppercase tracking-widest font-bold text-primary-500`;
  const HighlightedText = tw.span`text-primary-500`;

  return (
    <AnimationRevealPage>
      <Hero roundedHeaderButton={true}/>
      {/*<Features*/}
      {/*  subheading={<Subheading>Features</Subheading>}*/}
      {/*  heading={*/}
      {/*    <>*/}
      {/*      See, Build, <HighlightedText>Serve.</HighlightedText>*/}
      {/*    </>*/}
      {/*  }*/}
      {/*/>*/}
      {/*<MainFeature*/}
      {/*  subheading={<Subheading>Quality Work</Subheading>}*/}
      {/*  imageSrc={heroScreenshotImageSrc}*/}
      {/*  imageBorder={true}*/}
      {/*  imageDecoratorBlob={true}*/}
      {/*/>*/}
      <FeatureWithSteps
        subheading={<Subheading>No computer, just vision</Subheading>}
        heading={
          <>
            Don't think about AI, <HighlightedText>focus on business.</HighlightedText>
          </>
        }
        textOnLeft={false}
        imageSrc={appMockUpSrc}
        imageDecoratorBlob={false}
        // decoratorBlobCss={tw`xl:w-40 xl:h-40 opacity-15 -translate-x-1/2 left-1/2`}
      />
      <MainFeature2
        subheading={<Subheading>features</Subheading>}
        heading={
          <>
            A tool for Product Owners with <HighlightedText>vision.</HighlightedText>
          </>
        }
        description="The most straightforward way to implement your idea. Because no existing model is actually the one you need, HandsAi enables you to build your model based on your own and unique products."
        imageSrc={prototypeIllustrationImageSrc}
        showDecoratorBlob={false}
        features={[
          {
            Icon: FreeIcon,
            title: "Free",
            description: "You don't need data nor data scientists to start. Build on your own, check, for free.",
            iconContainerCss: tw`bg-green-300 text-green-800`,
          },
          {
            Icon: ImmediateIcon,
            title: "Immediate",
            description: "Instantly create and update your model with your smartphone.",
            iconContainerCss: tw`bg-green-300 text-green-800`,
          },
          {
            Icon: VersatileIcon,
            title: "Versatile",
            description: "Once you are done, your model is ready to be implemented on any platform or device.",
            iconContainerCss: tw`bg-green-300 text-green-800`,
          },
        ]}
        primaryButtonText="Request demo"
        primaryButtonUrl="/contact"
      />
      {/*<Pricing*/}
      {/*  subheading={<Subheading>Pricing</Subheading>}*/}
      {/*  heading={*/}
      {/*    <>*/}
      {/*      Reasonable & Flexible <HighlightedText>Plans.</HighlightedText>*/}
      {/*    </>*/}
      {/*  }*/}
      {/*  plans={[*/}
      {/*    {*/}
      {/*      name: "Personal",*/}
      {/*      price: "$17.99",*/}
      {/*      duration: "Monthly",*/}
      {/*      mainFeature: "For Individuals",*/}
      {/*      features: ["30 Templates", "7 Landing Pages", "12 Internal Pages", "Basic Assistance"]*/}
      {/*    },*/}
      {/*    {*/}
      {/*      name: "Business",*/}
      {/*      price: "$37.99",*/}
      {/*      duration: "Monthly",*/}
      {/*      mainFeature: "For Small Businesses",*/}
      {/*      features: ["60 Templates", "15 Landing Pages", "22 Internal Pages", "Priority Assistance"],*/}
      {/*      featured: true*/}
      {/*    },*/}
      {/*    {*/}
      {/*      name: "Enterprise",*/}
      {/*      price: "$57.99",*/}
      {/*      duration: "Monthly",*/}
      {/*      mainFeature: "For Large Companies",*/}
      {/*      features: ["90 Templates", "27 Landing Pages", "37 Internal Pages", "Personal Assistance"]*/}
      {/*    }*/}
      {/*  ]}*/}
      {/*/>*/}
      {/*<Testimonial*/}
      {/*  subheading={<Subheading>Testimonials</Subheading>}*/}
      {/*  heading={*/}
      {/*    <>*/}
      {/*      Our Clients <HighlightedText>Love Us.</HighlightedText>*/}
      {/*    </>*/}
      {/*  }*/}
      {/*  testimonials={[*/}
      {/*    {*/}
      {/*      stars: 5,*/}
      {/*      profileImageSrc:*/}
      {/*        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3.25&w=512&h=512&q=80",*/}
      {/*      heading: "Amazing User Experience",*/}
      {/*      quote:*/}
      {/*        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",*/}
      {/*      customerName: "Charlotte Hale",*/}
      {/*      customerTitle: "Director, Delos Inc.",*/}
      {/*    },*/}
      {/*    {*/}
      {/*      stars: 5,*/}
      {/*      profileImageSrc:*/}
      {/*        "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=512&h=512&q=80",*/}
      {/*      heading: "Love the Developer Experience and Design Principles !",*/}
      {/*      quote:*/}
      {/*        "Sinor Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",*/}
      {/*      customerName: "Adam Cuppy",*/}
      {/*      customerTitle: "Founder, EventsNYC",*/}
      {/*    },*/}
      {/*  ]}*/}
      {/*/>*/}
      {/*<FAQ*/}
      {/*  subheading={<Subheading>FAQS</Subheading>}*/}
      {/*  heading={*/}
      {/*    <>*/}
      {/*      You have <HighlightedText>Questions ?</HighlightedText>*/}
      {/*    </>*/}
      {/*  }*/}
      {/*  faqs={[*/}
      {/*    {*/}
      {/*      question: "Are all the templates easily customizable ?",*/}
      {/*      answer:*/}
      {/*        "Yes, they all are. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."*/}
      {/*    },*/}
      {/*    {*/}
      {/*      question: "How long do you usually support an standalone template for ?",*/}
      {/*      answer:*/}
      {/*        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."*/}
      {/*    },*/}
      {/*    {*/}
      {/*      question: "What kind of payment methods do you accept ?",*/}
      {/*      answer:*/}
      {/*        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."*/}
      {/*    },*/}
      {/*    {*/}
      {/*      question: "Is there a subscribption service to get the latest templates ?",*/}
      {/*      answer:*/}
      {/*        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."*/}
      {/*    },*/}
      {/*    {*/}
      {/*      question: "Are the templates compatible with the React ?",*/}
      {/*      answer:*/}
      {/*        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."*/}
      {/*    },*/}
      {/*    {*/}
      {/*      question: "Do you really support Internet Explorer 11 ?",*/}
      {/*      answer:*/}
      {/*        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."*/}
      {/*    }*/}
      {/*  ]}*/}
      {/*/>*/}
      <GetStarted/>
      <Footer/>
    </AnimationRevealPage>
  );
}
