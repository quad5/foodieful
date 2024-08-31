import { Box, List, ListItem, Stack, Typography } from '@mui/material';


export default function Privacy() {
    return (
        <Box marginX={5}>
            <Typography variant='h3' color='white' marginY={3} textAlign={'center'}>
                Privacy Policy
            </Typography>

            <Typography variant='body' color='white' >
                This Privacy Policy describes how Foodieful ("we", "us", "our") collects, uses, shares, and safeguards your information.
            </Typography>


            <Typography variant='h5' color='white' marginY={2}>
                Overview
            </Typography>

            <Box marginX={2}>
                <Typography variant='body' color='white'>
                    This Privacy Policy applies to our website, applications, products, and services that link to this policy or otherwise refer you to this policy (collectively, our "Services").

                    We used Privacy Policy Ace to generate this Privacy Policy.
                </Typography>
            </Box>

            <Typography variant='h5' color='white' marginTop={3}>
                Information Collection and Use
            </Typography>

            <List >
                <ListItem>
                    <Stack direction={'column'}>
                        <Typography variant='h6' color='white' gutterBottom>
                            Personal Data
                        </Typography>

                        <Box marginX={2}>
                            <Typography variant='body' color='white'>
                                When you use our Services, we may collect Personal Data, which refers to any information that identifies you personally. This includes, but is not limited to:
                                <List sx={{ listStyleType: 'disc', pl: 4 }}>
                                    <ListItem style={{ display: 'list-item' }}>
                                        Contact information such as your name, email address, mailing address, and phone number.
                                    </ListItem>

                                    <ListItem style={{ display: 'list-item' }}>
                                        Billing information such as credit card number, and billing address.
                                    </ListItem>

                                    <ListItem style={{ display: 'list-item' }}>
                                        Demographic information such as age, education, gender, interests, and zip code.
                                    </ListItem>
                                </List>
                            </Typography>
                        </Box>
                    </Stack>
                </ListItem>
                <ListItem>
                    <Stack direction={'column'}>
                        <Typography variant='h6' color='white' gutterBottom>
                            Non-Personal Data
                        </Typography>

                        <Box marginX={2}>
                            <Typography variant='body' color='white'>
                                We may also collect non-personal data, which is data that cannot be directly linked to an individual. This includes browser and device information, application usage data, information collected through cookies, pixel tags, and other technologies, and demographic information.
                            </Typography>
                        </Box>
                    </Stack>
                </ListItem>
                <ListItem>
                    <Stack direction={'column'}>
                        <Typography variant='h6' color='white' gutterBottom>
                            Use of Information
                        </Typography>

                        <Box marginX={2}>
                            <Typography variant='body' color='white'>
                                We use the information we collect for purposes including:

                                <List sx={{ listStyleType: 'disc', pl: 4 }}>
                                    <ListItem style={{ display: 'list-item' }}>
                                        Providing, maintaining, and improving our Services.
                                    </ListItem>
                                    <ListItem style={{ display: 'list-item' }}>
                                        Processing transactions and sending related information.
                                    </ListItem>
                                    <ListItem style={{ display: 'list-item' }}>
                                        Sending promotional communications.
                                    </ListItem>
                                    <ListItem style={{ display: 'list-item' }}>
                                        Responding to user inquiries and providing customer support.
                                    </ListItem>
                                    <ListItem style={{ display: 'list-item' }}>
                                        Conducting research and analysis.
                                    </ListItem>
                                    <ListItem style={{ display: 'list-item' }}>
                                        Ensuring network and information security.
                                    </ListItem>
                                </List>
                            </Typography>
                        </Box>
                    </Stack>
                </ListItem>
            </List>
            <Typography variant='h5' color='white' marginY={2}>
                Information Sharing
            </Typography>

            <Box marginX={2}>
                <Typography variant='body' color='white'>
                    We may share your personal information with third parties under the following circumstances:
                    <List sx={{ listStyleType: 'disc', pl: 4 }}>
                        <ListItem style={{ display: 'list-item' }}>
                            With your consent.
                        </ListItem>
                        <ListItem style={{ display: 'list-item' }}>
                            With third-party vendors and other service providers that perform services on our behalf.
                        </ListItem>
                        <ListItem style={{ display: 'list-item' }}>
                            If we believe disclosure is necessary to comply with relevant laws, to respond to legal requests, or to protect our rights, property, or safety.
                        </ListItem>
                        <ListItem style={{ display: 'list-item' }}>
                            In connection with any merger, sale of company assets, or acquisition.
                        </ListItem>
                    </List>
                </Typography>
            </Box>

            <Typography variant='h5' color='white' marginY={2}>
                Cookies and Tracking Technologies
            </Typography>

            <Box marginX={2}>
                <Typography variant='body' color='white'>
                    We may use cookies, logs, and various other tracking technologies to automatically collect information. You have the right to disable cookies at your browser level, though this may affect your ability to use certain features of our Services.

                    We display ads in order to show relevant advertisements:

                    <List sx={{ listStyleType: 'disc', pl: 4 }}>
                        <ListItem style={{ display: 'list-item' }}>
                            Our ad provider may use cookies to serve ads based on that user's interests.
                        </ListItem>
                        <ListItem style={{ display: 'list-item' }}>
                            It may be possible to opt out of personalized advertising for our provider.
                        </ListItem>
                    </List>

                    We use Google Adsense in order to show relevant advertisements:

                    <List sx={{ listStyleType: 'disc', pl: 4 }}>
                        <ListItem style={{ display: 'list-item' }}>
                            Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.
                        </ListItem>
                        <ListItem style={{ display: 'list-item' }}>
                            Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our sites and/or other sites on the Internet.
                        </ListItem>
                        <ListItem style={{ display: 'list-item' }}>
                            You may opt out of personalized advertising by visiting www.aboutads.info.
                        </ListItem>
                    </List>
                </Typography>
            </Box>

            <Typography variant='h5' color='white' marginY={2}>
                Security
            </Typography>

            <Box marginX={2}>
                <Typography variant='body' color='white' >
                    We employ reasonable physical, technical, and administrative measures designed to safeguard the information we collect. However, no security measure is 100% secure, and we cannot guarantee the absolute security of your information.
                </Typography>
            </Box>

            <Typography variant='h5' color='white' marginY={2}>
                International Data Transfers
            </Typography>

            <Box marginX={2}>
                <Typography variant='body' color='white'>
                    Personal information that you submit through the Services may be transferred to countries other than where you live, such as, for example, to our servers in the U.S. Your personal information may be subject to privacy laws that are different from those in your country.
                </Typography>
            </Box>

            <Typography variant='h5' color='white' marginY={2}>
                Your Rights and Choices
            </Typography>

            <Box marginX={2}>
                <Typography variant='body' color='white'>
                    Depending on your location, you may have certain rights in relation to your personal information. These may include: the right to access, rectification, erasure, restrict processing, or object to processing of your personal data, and the right to data portability.
                </Typography>
            </Box>

            <Typography variant='h5' color='white' marginY={2}>
                Children's Privacy
            </Typography>

            <Box marginX={2}>
                <Typography variant='body' color='white'>
                    Our Services are not directed to individuals under 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information.
                </Typography>
            </Box>

            <Typography variant='h5' color='white' marginTop={3}>
                CCPA Notice
            </Typography>
            <List>
                <ListItem>
                    <Stack direction={'column'}>
                        <Typography variant='h6' color='white' gutterBottom>
                            Notice of Collection and Use of Personal Information
                        </Typography>

                        <Box marginX={2}>
                            <Typography variant='body' color='white'>
                                We may collect the following categories of personal information about you:

                                <List sx={{ listStyleType: 'disc', pl: 4 }}>
                                    <ListItem style={{ display: 'list-item' }}>
                                        Identifiers: such as name, address, email address.
                                    </ListItem>
                                    <ListItem style={{ display: 'list-item' }}>
                                        Personal information: as defined in the California customer records law, such as contact information and financial information.
                                    </ListItem>
                                    <ListItem style={{ display: 'list-item' }}>
                                        Internet activity: such as your interactions with our Service.
                                    </ListItem>
                                    <ListItem style={{ display: 'list-item' }}>
                                        Geolocation data: such as device location.
                                    </ListItem>
                                    <ListItem style={{ display: 'list-item' }}>
                                        Professional or employment-related information: such as job history or employer information.
                                    </ListItem>
                                    <ListItem style={{ display: 'list-item' }}>
                                        We may use your personal information for the purposes listed in this Privacy Policy.
                                    </ListItem>
                                </List>
                            </Typography>
                        </Box>
                    </Stack>
                </ListItem>

                <ListItem>
                    <Stack direction={'column'}>
                        <Typography variant='h6' color='white' gutterBottom>
                            Our Personal Information Selling Practices
                        </Typography>

                        <Box marginX={2}>
                            <Typography variant='body' color='white'>
                                We do not sell your personal information in the traditional sense. We do share your information as outlined in the Information Sharing section of this Privacy Policy.
                            </Typography>
                        </Box>
                    </Stack>
                </ListItem>

                <ListItem>
                    <Stack direction={'column'}>
                        <Typography variant='h6' color='white' gutterBottom>
                            Rights Under CCPA
                        </Typography>

                        <Box marginX={2}>
                            <Typography variant='body' color='white'>
                                If you are a California resident, you have the following rights:

                                <List sx={{ listStyleType: 'disc', pl: 4 }}>
                                    <ListItem style={{ display: 'list-item' }}>
                                        Right to Know: You have the right to request that we disclose what personal information we collect, use, disclose, and sell about you.
                                    </ListItem>
                                    <ListItem style={{ display: 'list-item' }}>
                                        Right to Delete: You have the right to request the deletion of your personal information that we have collected or maintain, subject to certain exceptions.
                                    </ListItem>
                                    <ListItem style={{ display: 'list-item' }}>
                                        Right to Opt-Out: You have the right to opt out of the sale of your personal information.
                                    </ListItem>
                                    <ListItem style={{ display: 'list-item' }}>
                                        Right to Non-Discrimination: You have the right not to receive discriminatory treatment for exercising your CCPA rights.
                                    </ListItem>
                                </List>
                            </Typography>
                        </Box>
                    </Stack>
                </ListItem>

                <ListItem>
                    <Stack direction={'column'}>
                        <Typography variant='h6' color='white' gutterBottom >
                            Exercising Your CCPA Data Protection Rights
                        </Typography>

                        <Box marginX={2}>
                            <Typography variant='body' color='white'>
                                To exercise any of your rights under the CCPA, please contact us using the following methods:

                                Email: foodieful.net@proton.me
                                Website: https://www.foodieful.net
                                Please note that we may need to verify your identity before processing your request, which may require additional personal information from you. In certain circumstances, we may decline or limit your request, particularly where we are unable to verify your identity or locate your information in our systems, or as permitted by law.
                            </Typography>
                        </Box>
                    </Stack>
                </ListItem>
            </List>
            <Typography variant='h5' color='white' marginY={2}>
                Changes to this Privacy Policy
            </Typography>

            <Box marginX={2}>
                <Typography variant='body' color='white' >
                    We reserve the right to modify this Privacy Policy at any time, so please review it frequently. Changes will be posted on this page and your continued use of our Services after any changes have been posted will constitute your agreement to such changes.
                    This Privacy Policy was generated with Privacy Policy Ace.
                </Typography>
            </Box>

            <Typography variant='h5' color='white' marginY={2}>
                Contact Us
            </Typography>

            <Box marginX={2}>
                <Typography variant='body' color='white'>
                    If you have any questions about this Privacy Policy, please contact us at foodieful.net@proton.me.
                </Typography>
            </Box>

            <Typography variant='h6' color='white' marginY={2}>
                Last updated: 8/30/2024
            </Typography>
        </Box>
    )
}