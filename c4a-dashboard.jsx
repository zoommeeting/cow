import React from 'react'
import styled from 'styled-components'

import { Box, H2, H5, Text, Illustration } from 'admin-bro'
import { useTranslation } from 'admin-bro'

const pageHeaderHeight = 284
const pageHeaderPaddingY = 74
const pageHeaderPaddingX = 250

const DashboardHeader = () => {
  const { translateMessage } = useTranslation()
  return (
    <Box position="relative" overflow="hidden">
      <Box
        position="absolute"
        top={50}
        left={-10}
        opacity={[0.2, 0.4, 1]}
        animate
      >
        <Illustration variant="Rocket" />
      </Box>
      <Box
        position="absolute"
        top={-70}
        right={-15}
        opacity={[0.2, 0.4, 1]}
        animate
      >
        <Illustration variant="Moon" />
      </Box>
      <Box
        bg="grey100"
        height={pageHeaderHeight}
        py={pageHeaderPaddingY}
        px={['default', 'lg', pageHeaderPaddingX]}
      >
        <Text textAlign="center" color="white">
          <H2>{"Welcome to Cauldron of War"}</H2>
          <Text opacity="0.8">
            {translateMessage('welcomeOnBoard_subtitle')}
          </Text>
        </Text>
      </Box>
    </Box>
  )
}

const boxes = ({ translateMessage }) => [{
  variant: 'DocumentCheck',
  title: 'Stuff',
  subtitle: 'Check out the cool stuff!',
  href: '/user/portal',
},
/*
{
    variant: 'Planet',
    title: 'Support',
    subtitle: 'Contact Support',
    href: '/user/pages/contactSupport',
},
{
    variant: 'Astronaut',
    title: 'Issues',
    subtitle: 'Issue Tracking',
    href: '/user/pages/issueTracking',
}*/]

const Card = styled(Box)`
  display: ${({ flex }) => (flex ? 'flex' : 'block')};
  color: ${({ theme }) => theme.colors.grey100};
  text-decoration: none;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid ${({ theme }) => theme.colors.primary100};
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
  }
`

Card.defaultProps = {
  variant: 'white',
  boxShadow: 'card',
}

const Dashboard = () => {
  const { translateMessage } = useTranslation()
  return (
    <Box>
      <DashboardHeader />
      <Box
        mt={['xl', 'xl', '-100px']}
        mb="xl"
        mx={[0, 0, 0, 'auto']}
        px={['default', 'lg', 'xxl', '0']}
        position="relative"
        flex
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="center"
        width={[1, 1, 1, 1024]}
      >
        {boxes({ translateMessage }).map((box, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Box key={index} width={[1, 1 / 2, 1 / 2, 1 / 3]} p="lg">
            <Card as="a" href={box.href}>
              <Text textAlign="center">
                <Illustration
                  variant={box.variant}
                  width={100}
                  height={70}
                />
                <H5 mt="lg">{box.title}</H5>
                <Text>{box.subtitle}</Text>
              </Text>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default Dashboard
