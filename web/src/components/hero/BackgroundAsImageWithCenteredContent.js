import React from "react";
import styled from "styled-components";
import tw from "twin.macro";

import Header, {
  DesktopNavLinks,
  LogoLink,
  NavLink,
  NavToggle,
  PrimaryLink as PrimaryLinkBase,
} from "../headers/light.js";

const StyledHeader = styled(Header)`
  ${tw`pt-8 max-w-none w-full`}
  ${DesktopNavLinks} ${NavLink}, ${LogoLink} {
    ${tw`text-gray-100 hover:border-gray-300 hover:text-gray-300`}
  }
  ${NavToggle}.closed {
    ${tw`text-gray-100 hover:text-primary-500`}
  }
`;

const PrimaryLink = tw(
  PrimaryLinkBase
)`rounded-full px-8 py-3 mt-10 text-sm sm:text-base sm:mt-16 sm:px-8 sm:py-4 bg-gray-100 font-bold shadow transition duration-300 bg-primary-500 text-gray-100 hocus:bg-primary-700 hocus:text-gray-200 focus:outline-none focus:shadow-outline`;
const Container = styled.div`
  ${tw`relative -mx-8 -mt-8 bg-center bg-cover h-screen min-h-144`}
  background-image: url("https://source.unsplash.com/rWMIbqmOxrY/1600x900");
`;

const OpacityOverlay = tw.div`z-10 absolute inset-0 bg-black opacity-75`;

const HeroContainer = tw.div`z-20 relative px-6 sm:px-8 mx-auto h-full flex flex-col`;
const Content = tw.div`px-4 flex flex-1 flex-col justify-center items-center`;

const Heading = styled.h1`
  ${tw`text-3xl text-center sm:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-100 leading-snug -mt-24 sm:mt-0`}
  span {
    ${tw`inline-block`}
  }
  p {
    ${tw`text-2xl mt-2 sm:mt-10`}
  }
`;

export default () => {
  const navLinks = [];

  return (
    <Container>
      <OpacityOverlay />
      <HeroContainer>
        <StyledHeader links={navLinks} />
        <Content>
          <Heading>
            Your products, <span tw="text-primary-500">your AI.</span>
            <p>
              Build and test your computer vision models with your smartphone,
              in minutes
            </p>
          </Heading>
          <PrimaryLink href="mailto:clement0walter@gmail.com">
            Request demo
          </PrimaryLink>
        </Content>
      </HeroContainer>
    </Container>
  );
};
