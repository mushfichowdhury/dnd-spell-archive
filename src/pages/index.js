import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useState, useEffect } from "react";
import SpellCard from "@/components/SpellCard";
// MUI imports
import {
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	CircularProgress,
	IconButton,
	Typography,
	Box,
	Grid2 as Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export async function getStaticProps() {
	// Fetch all spells
	const response = await fetch("https://www.dnd5eapi.co/api/spells");
	const data = await response.json();

	// Fetch details for each spell
	const spellsDetails = await Promise.all(
		data.results.map(async (spell) => {
			const spellRes = await fetch(
				`https://www.dnd5eapi.co/api/spells/${spell.index}`
			);
			return spellRes.json();
		})
	);

	// Fetch classes
	const classesResponse = await fetch("https://www.dnd5eapi.co/api/classes");
	const classesData = await classesResponse.json();
	const spellcastingClasses = classesData.results.filter((c) =>
		[
			"bard",
			"cleric",
			"druid",
			"paladin",
			"ranger",
			"sorcerer",
			"warlock",
			"wizard",
		].includes(c.index)
	);

	// Fetch spells for each class
	const classSpells = {};
	await Promise.all(
		spellcastingClasses.map(async (c) => {
			const spellsRes = await fetch(
				`https://www.dnd5eapi.co/api/classes/${c.index}/spells`
			);
			const spellsData = await spellsRes.json();
			classSpells[c.index] = spellsData.results.map((spell) => spell.index);
		})
	);

	return {
		props: {
			initialSpells: spellsDetails,
			initialClasses: spellcastingClasses,
			initialClassSpells: classSpells,
		},
		// Revalidate every 24 hours
		revalidate: 86400,
	};
}

export default function Home({
	initialSpells,
	initialClasses,
	initialClassSpells,
}) {
	const [spells, setSpells] = useState(initialSpells);
	const [filteredSpells, setFilteredSpells] = useState(initialSpells);
	const [loading, setLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [levelFilter, setLevelFilter] = useState("all");
	const [schoolFilter, setSchoolFilter] = useState("all");
	const [classFilter, setClassFilter] = useState("all");
	const [classes] = useState(initialClasses);
	const [classSpells] = useState(initialClassSpells);

	// Update useEffect for filtering
	useEffect(() => {
		let result = spells;

		if (searchTerm) {
			result = result.filter(
				(spell) =>
					spell.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					spell.desc[0].toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		if (levelFilter !== "all") {
			result = result.filter((spell) => spell.level === parseInt(levelFilter));
		}

		if (schoolFilter !== "all") {
			result = result.filter(
				(spell) =>
					spell.school.name.toLowerCase() === schoolFilter.toLowerCase()
			);
		}

		if (classFilter !== "all") {
			result = result.filter((spell) =>
				classSpells[classFilter]?.includes(spell.index)
			);
		}

		setFilteredSpells(result);
	}, [spells, searchTerm, levelFilter, schoolFilter, classFilter, classSpells]);

	return (
		<>
			<Head>
				<title>D&D Spells Database</title>
				<meta
					name='description'
					content='D&D 5e Spells Database with search and filters'
				/>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<div
				className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}>
				<div className={styles.stickyHeader}>
					<Typography
						variant='h4'
						component='h1'
						gutterBottom
						sx={{ textAlign: "center", marginBottom: "36px" }}>
						D&D 5e Spell Tomes
					</Typography>

					<Box sx={{ mb: 3 }}>
						<Grid
							container
							spacing={2}
							alignItems='center'
							justifyContent='center'
							sx={{ maxWidth: "800px", margin: "0 auto" }}>
							<Grid xs={12} sm={6} md={4}>
								<FormControl fullWidth>
									<InputLabel>Class</InputLabel>
									<Select
										value={classFilter}
										onChange={(e) => setClassFilter(e.target.value)}
										label='Class'>
										<MenuItem value='all'>All Classes</MenuItem>
										{classes.map((c) => (
											<MenuItem key={c.index} value={c.index}>
												{c.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid xs={12} sm={6} md={4}>
								<FormControl fullWidth>
									<InputLabel>Level</InputLabel>
									<Select
										value={levelFilter}
										onChange={(e) => setLevelFilter(e.target.value)}
										label='Level'>
										<MenuItem value='all'>All Levels</MenuItem>
										{[...Array(10)].map((_, i) => (
											<MenuItem key={i} value={i}>
												{i === 0 ? "Cantrip" : `Level ${i}`}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid xs={12} sm={6} md={4}>
								<FormControl fullWidth>
									<InputLabel>School</InputLabel>
									<Select
										value={schoolFilter}
										onChange={(e) => setSchoolFilter(e.target.value)}
										label='School'>
										<MenuItem value='all'>All Schools</MenuItem>
										{[
											"Abjuration",
											"Conjuration",
											"Divination",
											"Enchantment",
											"Evocation",
											"Illusion",
											"Necromancy",
											"Transmutation",
										].map((school) => (
											<MenuItem key={school} value={school}>
												{school}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid xs={12}>
								<TextField
									fullWidth
									variant='outlined'
									placeholder='Search spells...'
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									InputProps={{
										startAdornment: (
											<SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
										),
									}}
								/>
							</Grid>
						</Grid>
					</Box>
				</div>

				<main className={styles.main}>
					<div className={styles.spellsContainer}>
						{loading ? (
							<Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
								<CircularProgress />
							</Box>
						) : (
							<>
								<div className={styles.spellGrid}>
									{filteredSpells.map((spell) => (
										<div key={spell.index} className={styles.spellCardWrapper}>
											<SpellCard spell={spell} />
										</div>
									))}
								</div>

								{!loading && filteredSpells.length === 0 && (
									<Typography
										variant='h6'
										color='text.secondary'
										sx={{ textAlign: "center", mt: 4 }}>
										No spells found matching your criteria
									</Typography>
								)}
							</>
						)}
					</div>
				</main>

				<footer className={styles.footer}>
					<IconButton
						href='https://www.linkedin.com/in/mushfi-chowdhury'
						target='_blank'
						rel='noopener noreferrer'
						color='primary'>
						<LinkedInIcon />
						<Typography sx={{ ml: 1 }}>LinkedIn</Typography>
					</IconButton>
					<IconButton
						href='https://github.com/mushfichowdhury'
						target='_blank'
						rel='noopener noreferrer'
						color='primary'>
						<GitHubIcon />
						<Typography sx={{ ml: 1 }}>GitHub</Typography>
					</IconButton>
				</footer>
			</div>
		</>
	);
}
