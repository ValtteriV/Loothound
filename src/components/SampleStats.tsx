import { Group, Paper, SimpleGrid, Text, createStyles, rem } from '@mantine/core';
import {
	IconArrowDownRight,
	IconArrowUpRight,
	IconChartLine,
	IconClockHour3,
	IconCoin,
} from '@tabler/icons-react';
import { useGetSnapshots } from '../services/services';
import { Snapshot } from '../bindings';

type Props = {
	total: number;
	selectedProfileId: number | bigint | null;
};

interface StatsGridData {
	title: string;
	icon: keyof typeof icons;
	value: string;
	diff?: number;
}

const icons = {
	netWorth: IconCoin,
	income: IconChartLine,
	snapshot: IconClockHour3,
};

export function SampleStats({ total, selectedProfileId }: Props) {
	const { classes } = useStyles();

	const { data: snapshotData, isFetching: isSnapshotDataFetching } = useGetSnapshots(
		Number(selectedProfileId),
		{
			enabled: !!selectedProfileId,
		}
	);

	console.log(snapshotData);

	const getDiff = (snapshots: Snapshot[] | undefined) => {
		if (!snapshots) return 0;
		if (snapshots.length === 0) return 0;
		if (snapshots.length === 1) return snapshots[0].pricing_revision;
		if (snapshots.length >= 2) return snapshots[0].pricing_revision + snapshots[1].pricing_revision;
	};

	function getData(total: number): StatsGridData[] {
		return [
			{
				title: 'Net Worth',
				icon: 'netWorth',
				value:
					total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
					' div',
				diff: Number(getDiff(snapshotData)),
			},
			{
				title: 'Income',
				icon: 'income',
				value:
					Number(420).toLocaleString(undefined, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					}) + '/h',
				diff: 0,
			},
			{
				title: 'Snapshot Count',
				icon: 'snapshot',
				value: snapshotData ? String(snapshotData?.length) : '0',
			},
		];
	}

	const stats = getData(total).map((stat) => {
		const Icon = icons[stat.icon];
		const DiffIcon = stat.diff && stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

		return (
			<Paper withBorder p="md" radius="md" key={stat.title}>
				<Group position="apart">
					<Text size="xs" className={classes.title}>
						{stat.title}
					</Text>
					<Icon className={classes.icon} size="24px" stroke={1.5} />
				</Group>

				<Group align="flex-end" spacing="xs" mt={36}>
					<Text className={classes.value}>{stat.value}</Text>
					<Text
						color={stat.diff && stat.diff > 0 ? 'teal' : 'red'}
						fz="sm"
						fw={500}
						className={classes.diff}
					>
						{stat.diff ? (
							<>
								<span>{stat.diff}%</span>
								<DiffIcon size="16px" stroke={1.5} />
							</>
						) : (
							<></>
						)}
					</Text>
				</Group>
				{stat.diff ? (
					<Text fz="xs" c="dimmed" mt={7}>
						Compared to previous snapshot
					</Text>
				) : (
					<></>
				)}
			</Paper>
		);
	});
	return (
		<div className={classes.root}>
			<SimpleGrid className={classes.grid} cols={3}>
				{stats}
			</SimpleGrid>
		</div>
	);
}

const useStyles = createStyles((theme) => ({
	root: {
		padding: `0 calc(${theme.spacing.xl} * 1.5)`,
		display: 'flex',
		width: '100%',
	},

	value: {
		fontSize: rem(24),
		fontWeight: 700,
		lineHeight: 1,
	},

	grid: {
		width: '100%',
	},

	diff: {
		lineHeight: 1,
		display: 'flex',
		alignItems: 'center',
	},

	icon: {
		color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
	},

	title: {
		fontWeight: 700,
		textTransform: 'uppercase',
	},
}));
