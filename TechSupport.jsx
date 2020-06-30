import React from 'react';
import styled from 'styled-components'
import { Box, H3, H5, Text, Illustration } from 'admin-bro'

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


const contactSupport = (props) => {
  return (
    <Box variant="grey" width={[1, 1/3]} p="lg">

            <Card>
                <Text textAlign="center">
                    <Illustration
                        variant={"Planet"}
                        width={100}
                        height={70}
                    />
                    <H3 mt="lg">{"Contact Support"}</H3>
                    <Text mt="lg">
                        {"Support requests can be emailed to "} <a href={"mailto:support@crypto4a.com"}>support@crypto4a.com</a> {", or, reach out to your technical contact(s) directly."}
                    </Text>
                </Text>
            </Card>

    </Box>
  );
};

export default contactSupport;
