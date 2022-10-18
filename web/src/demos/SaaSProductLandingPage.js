import GetStarted from "components/cta/GetStarted";
import FeatureWithSteps from "components/features/TwoColWithSteps.js";
import MainFeature2 from "components/features/TwoColWithTwoHorizontalFeaturesAndButton.js";
import Footer from "components/footers/FiveColumnWithBackground.js";
import Hero from "components/hero/BackgroundAsImageWithCenteredContent.js";
import { ReactComponent as VersatileIcon } from "feather-icons/dist/icons/code.svg";
import { ReactComponent as FreeIcon } from "feather-icons/dist/icons/dollar-sign.svg";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { ReactComponent as ImmediateIcon } from "images/fast-icon.svg";
import appMockUpSrc from "images/mockups/iterate_mockup.png";
import prototypeIllustrationImageSrc from "images/prototype-illustration.svg";
import React from "react";
import tw from "twin.macro";

export default () => {
  const Subheading = tw.span`uppercase tracking-widest font-bold text-primary-500`;
  const HighlightedText = tw.span`text-primary-500`;

  return (
    <AnimationRevealPage>
      <Hero roundedHeaderButton={true} />
      <FeatureWithSteps
        subheading={<Subheading>No computer, just vision</Subheading>}
        heading={
          <>
            Don't think about AI,{" "}
            <HighlightedText>focus on business.</HighlightedText>
          </>
        }
        textOnLeft={false}
        imageSrc={appMockUpSrc}
        imageDecoratorBlob={false}
      />
      <MainFeature2
        subheading={<Subheading>features</Subheading>}
        heading={
          <>
            A tool for Product Owners with{" "}
            <HighlightedText>vision.</HighlightedText>
          </>
        }
        description="The most straightforward way to implement your idea. Because no existing model is actually the one you need, HandsAi enables you to build your model based on your own and unique products."
        imageSrc={prototypeIllustrationImageSrc}
        showDecoratorBlob={false}
        features={[
          {
            Icon: FreeIcon,
            title: "Efficient",
            description:
              "You don't need data nor data scientists to start. Build on your own, check, for free.",
            iconContainerCss: tw`bg-green-300 text-green-800`,
          },
          {
            Icon: ImmediateIcon,
            title: "Immediate",
            description:
              "Instantly create and update your model with your smartphone.",
            iconContainerCss: tw`bg-green-300 text-green-800`,
          },
          {
            Icon: VersatileIcon,
            title: "Versatile",
            description:
              "Once you are done, your model is ready to be implemented on any platform or device.",
            iconContainerCss: tw`bg-green-300 text-green-800`,
          },
        ]}
        primaryButtonText="Request demo"
        primaryButtonUrl="mailto:clement0walter@gmail.com"
      />
      <GetStarted />
      <Footer />
    </AnimationRevealPage>
  );
};
