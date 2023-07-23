const Footer = styled.div`
width: 100%;
text-align: center;
background-color: #343a40;
align-items: center;
display: flex;
flex-direction: column;
margin-top: auto
`;
const HorizontalLine = styled.hr`
width: 100%;
border: none;
border-top: 1px solid #fff;
`;
const FooterText = styled.p`
font-size: 14px;
color: #fff;
`;

return (
  <Footer>
    <HorizontalLine />
    <FooterText>Made with &#x2665; by KNW Technologies FZCO</FooterText>
  </Footer>
);
