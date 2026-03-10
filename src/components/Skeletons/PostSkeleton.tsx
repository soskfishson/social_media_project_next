'use client';

import { Card, CardHeader, CardContent, CardActions, Skeleton } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
    width: '100%',
    marginBottom: '16px',
    border: `2px solid ${theme.palette.divider}`,
}));

const StyledCardActions = styled(CardActions)(() => ({
    padding: '16px 24px',
    gap: '16px',
}));

export const PostSkeleton = () => {
    return (
        <StyledCard>
            <CardHeader
                avatar={<Skeleton variant="circular" width={48} height={48} />}
                title={<Skeleton variant="text" width="30%" />}
                subheader={<Skeleton variant="text" width="20%" />}
                sx={{
                    padding: '24px',
                }}
            />

            <Skeleton
                variant="rectangular"
                height={400}
                sx={{
                    width: '700px',
                }}
            />

            <CardContent sx={{ padding: '24px' }}>
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="text" width="80%" />
            </CardContent>

            <StyledCardActions>
                <Skeleton variant="rounded" width={100} height={32} />
                <Skeleton variant="rounded" width={120} height={32} />
                <Skeleton variant="rounded" width={40} height={32} />
            </StyledCardActions>
        </StyledCard>
    );
};

export default PostSkeleton;
