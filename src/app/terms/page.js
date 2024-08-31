import { Box, Link, List, ListItem, Stack, Typography } from '@mui/material';


export default function Terms() {
    return (
        <Box marginX={5}>

            <Typography variant='h3' color='white' marginTop={3} textAlign={'center'}>
                Terms Of Service
            </Typography>

            <Typography variant='h4' color='white' marginY={2}>
                Acceptance Of Terms
            </Typography>

            <Box marginX={2}>
                <Typography variant='body' color='white' >
                    This website ({`"`}Site{`"`}) is owned and operated by Foodieful ({`"`}we{`"`}, {`"`}us{`"`} or {`"`}Company{`"`}). By accessing and using this Site and its related software, networks, and processes, including the purchase of any products or services through this Site, you are agreeing to these Terms of Service ({`"`}Terms{`"`}). If you do not agree to these Terms, do not use this Site.
                </Typography>
            </Box>

            <Typography variant='h4' color='white' marginY={2}>
                Registration
            </Typography>

            <Box marginX={2}>
                <Typography variant='body' color='white'>
                    To access certain features of the Site, we may ask you to provide certain demographic information including your gender, year of birth, zip code, and country. You agree to provide true, accurate, current, and complete information about yourself as prompted by the Site registration form.
                </Typography>
            </Box>

            <Typography variant='h4' color='white' marginY={2}>
                Privacy
            </Typography>

            <Box marginX={2}>
                <Typography variant='body' color='white'>
                    Please review our <Link href="/privacy" target="_blank" rel="noopener">Privacy Policy</Link>, which also governs your visit to this Site, to understand our practices.
                </Typography>
            </Box>

            <Typography variant='h4' color='white' marginY={2}>
                Changes To Terms
            </Typography>

            <Box marginX={2}>
                <Typography variant='body' color='white'>
                    We reserve the right, at our discretion, to update or revise these Terms. Please check the Terms periodically for changes. Your continued use of this Site following the posting of any changes to the Terms constitutes acceptance of those changes.
                </Typography>
            </Box>

            <Typography variant='h4' color='white' marginY={2}>
                User Conduct
            </Typography>

            <Box marginX={2}>
                <Typography variant='body' color='white'>
                    You are solely responsible for the content and context of any materials you post or submit through the Site. You warrant and agree that, while using the Site, you shall not upload, post or transmit to the Site any materials which:
                    are unlawful, harmful, threatening, or abusive restrict or inhibit any other user from using and enjoying the Site constitute or encourage conduct that would constitute a criminal offense
                </Typography>
            </Box>

            <Typography variant='h4' color='white' marginY={2}>
                Proprietary Rights
            </Typography>

            <Box marginX={2}>
                <Typography variant='body' color='white'>
                    You acknowledge and agree that the content, software, and other materials available on this Site are protected by copyrights, trademarks, service marks, patents, trade secrets, or other proprietary rights and laws. Except as expressly authorized by us, you agree not to sell, license, rent, modify, distribute, copy, reproduce, or create derivative works from such content, software, and materials.
                </Typography>
            </Box>

            <Typography variant='h4' color='white' marginY={2}>
                Disclaimer Of Warranties
            </Typography>

            <Box marginX={2}>
                <Typography variant='body' color='white'>
                    The site, including, without limitation, all content, functions, and materials is provided {`"`}as is,{`"`} without warranty of any kind, either express or implied.
                </Typography>
            </Box>

            <Typography variant='h4' color='white' marginY={2}>
                Limitation Of Liability
            </Typography>

            <Box marginX={2}>
                <Typography variant='body' color='white'>
                    In no event shall we or our affiliates be liable for any indirect, incidental, special, or consequential damages arising out of or related to the use, inability to use, performance or nonperformance of the services, even if we have been advised of the possibility of such damages.
                </Typography>
            </Box>

            <Typography variant='h4' color='white' marginY={2}>
                Indemnity
            </Typography>

            <Box marginX={2}>
                <Typography variant='body' color='white'>
                    You will indemnify and hold us, and our subsidiaries, affiliates, officers, agents, and employees, harmless from any claim or demand, including reasonable attorneys{`'`} fees, made by any third party due to or arising out of your use of the Site, the violation of these Terms by you, or the infringement by you, or any other user of the Site using your account, of any intellectual property or other right of any person or entity.
                </Typography>
            </Box>

            <Typography variant='h4' color='white' marginY={2}>
                Termination
            </Typography>

            <Box marginX={2}>
                <Typography variant='body' color='white'>
                    We may terminate or suspend your access to the Site at any time, with or without cause, and with or without notice. Upon such termination or suspension, your right to use the Site will immediately cease.
                </Typography>
            </Box>

            <Typography variant='h4' color='white' marginTop={2}>
                Digital Millennium Copyright Act (DMCA) Policy
            </Typography>

            <List>
                <ListItem>
                    <Stack direction={'column'}>
                        <Typography variant='h5' color='white' marginBottom={2}>
                            Notifications
                        </Typography>

                        <Box marginX={2}>
                            <Typography variant='body' color='white'>

                                If you believe that content available on our website infringes on your copyright(s), please notify us by providing a DMCA notice. Upon receipt of a valid and complete notice, we will remove the infringing material and make a good faith attempt to contact the user who uploaded the infringing material by email.

                                Your DMCA notice must include:
                                <List sx={{ listStyleType: 'disc', pl: 4 }}>
                                    <ListItem style={{ display: 'list-item' }}>
                                        Identification of the copyrighted work you believe to be infringed.
                                    </ListItem>
                                    <ListItem style={{ display: 'list-item' }}>
                                        Identification of the material on our site that you claim is infringing, with a link or other description to allow us to locate it.
                                    </ListItem>
                                    <ListItem style={{ display: 'list-item' }}>
                                        Your name, mailing address, telephone number, and email address.
                                    </ListItem>
                                    <ListItem style={{ display: 'list-item' }}>
                                        A statement that you have a good faith belief that use of the copyrighted material in the manner complained of is not authorized by the copyright owner, its agent, or the law.
                                    </ListItem>
                                    <ListItem style={{ display: 'list-item' }}>
                                        A statement, made under penalty of perjury, that the information in your notice is accurate, and that you are the copyright owner or are authorized to act on the copyright owner{`'`}s behalf.
                                    </ListItem>
                                    <ListItem style={{ display: 'list-item' }}>
                                        An electronic or physical signature of the copyright owner or a person authorized to act on their behalf.
                                    </ListItem>
                                </List>
                                Please submit your notice to our designated Copyright Agent via Email:

                                foodieful.net@proton.me
                            </Typography>
                        </Box>
                    </Stack>
                </ListItem>
                <ListItem>
                    <Stack direction={'column'}>
                        <Typography variant='h5' color='white' marginY={2}>
                            Counter-Notification
                        </Typography>

                        <Box marginX={2}>
                            <Typography variant='body' color='white'>
                                If you believe that your material has been removed in error due to a DMCA request, you have the right to provide us with a counter-notification. This counter-notification must contain:

                                <List sx={{ listStyleType: 'disc', pl: 4 }}>
                                    <ListItem style={{ display: 'list-item' }}>
                                        Identification of the material that has been removed or to which access has been disabled and the location at which the material appeared before it was removed or access to it was disabled.
                                    </ListItem>
                                    <ListItem style={{ display: 'list-item' }}>
                                        A statement under penalty of perjury that the subscriber has a good faith belief that the material was removed or disabled as a result of mistake or misidentification of the material to be removed or disabled.
                                    </ListItem>
                                    <ListItem style={{ display: 'list-item' }}>
                                        The subscriber{`'`}s name, address, and telephone number, and a statement that the subscriber consents to the jurisdiction of the Federal District Court for the judicial district in which the address is located.
                                    </ListItem>
                                    <ListItem style={{ display: 'list-item' }}>
                                        A physical or electronic signature of the subscriber.
                                    </ListItem>
                                    <ListItem style={{ display: 'list-item' }}>
                                        Please send the counter-notification to our designated Copyright Agent at the address provided above.
                                    </ListItem>
                                </List>
                            </Typography>
                        </Box>
                    </Stack>
                </ListItem>
            </List>
            <Typography variant='h4' color='white' marginBottom={2}>
                Miscellaneous
            </Typography>

            <Box marginX={2}>
                <Typography variant='body' color='white'>
                    These Terms constitute the entire agreement between us and you with respect to the subject matter herein and supersede all previous and contemporaneous agreements, proposals and communications, written or oral between us. Any rights not expressly granted herein are reserved.
                    We used Privacy Policy Ace to generate this Terms of Service.
                </Typography>
            </Box>

            <Typography variant='h6' color='white' marginY={2}>
                Last Updated: 8/30/2024
            </Typography>
        </Box>
    )
}