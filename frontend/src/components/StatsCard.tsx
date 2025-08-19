
import { type LucideIcon } from 'lucide-react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow'
  trend?: {
    value: number
    label: string
  }
  className?: string
}

const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  trend,
  className = '',
}: StatsCardProps) => {

  const colorMap = {
    blue: { icon: '#1976d2', bg: '#e3f2fd', trend: '#1976d2' },
    green: { icon: '#388e3c', bg: '#e8f5e9', trend: '#388e3c' },
    purple: { icon: '#7b1fa2', bg: '#f3e5f5', trend: '#7b1fa2' },
    red: { icon: '#d32f2f', bg: '#ffebee', trend: '#d32f2f' },
    yellow: { icon: '#fbc02d', bg: '#fffde7', trend: '#fbc02d' },
  };
  const colors = colorMap[color];

  return (
    <Card elevation={3} sx={{ borderRadius: 2, minWidth: 220, boxShadow: 3, m: 1 }} className={className}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={700} color="text.primary" mb={0.5}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, color: colors.trend, fontSize: 13 }}>
              <Typography component="span" sx={{ fontWeight: 500 }}>
                {trend.value > 0 ? '+' : ''}{trend.value}
              </Typography>
              <Typography component="span" sx={{ ml: 1, color: '#757575' }}>
                {trend.label}
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ p: 1.5, borderRadius: '50%', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon style={{ height: 28, width: 28, color: colors.icon }} />
        </Box>
      </CardContent>
    </Card>
  );
}

export default StatsCard
