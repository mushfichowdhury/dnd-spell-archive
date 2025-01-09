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
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export default function Home() {
	const [spells, setSpells] = useState([]);
	const [filteredSpells, setFilteredSpells] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [levelFilter, setLevelFilter] = useState("all");
	const [schoolFilter, setSchoolFilter] = useState("all");
	const [classFilter, setClassFilter] = useState("all");
	const [classSpells, setClassSpells] = useState({});
	const [classes, setClasses] = useState([]);

	// Fetch all spells
	useEffect(() => {
		const fetchAllSpells = async () => {
			try {
				const response = await fetch("https://www.dnd5eapi.co/api/spells");
				const data = await response.json();
				const allSpellDetails = await Promise.all(
					data.results.map(async (spell) => {
						const detailResponse = await fetch(
							`https://www.dnd5eapi.co${spell.url}`
						);
						return detailResponse.json();
					})
				);
				setSpells(allSpellDetails);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching spells:", error);
				setLoading(false);
			}
		};

		fetchAllSpells();
	}, []);

	// Fetch classes and their spells
	useEffect(() => {
		const fetchClasses = async () => {
			try {
				const response = await fetch("https://www.dnd5eapi.co/api/classes");
				const data = await response.json();
				const spellcastingClasses = data.results.filter((c) =>
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
				setClasses(spellcastingClasses);

				// Fetch spells for each class
				const spellsByClass = {};
				await Promise.all(
					spellcastingClasses.map(async (c) => {
						const spellsResponse = await fetch(
							`https://www.dnd5eapi.co/api/classes/${c.index}/spells`
						);
						const spellsData = await spellsResponse.json();
						spellsByClass[c.index] = spellsData.results.map(
							(spell) => spell.index
						);
					})
				);
				setClassSpells(spellsByClass);
			} catch (error) {
				console.error("Error fetching classes:", error);
			}
		};

		fetchClasses();
	}, []);

	// Filter spells
	useEffect(() => {
		let result = spells;

		// Search filter
		if (searchTerm) {
			result = result.filter(
				(spell) =>
					spell.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					spell.desc[0].toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Level filter
		if (levelFilter !== "all") {
			result = result.filter((spell) => spell.level === parseInt(levelFilter));
		}

		// School filter
		if (schoolFilter !== "all") {
			result = result.filter(
				(spell) =>
					spell.school.name.toLowerCase() === schoolFilter.toLowerCase()
			);
		}

		// Class filter
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
						href='https://nextjs.org/learn'
						target='_blank'
						rel='noopener noreferrer'
						color='primary'>
						<Image src='/file.svg' alt='File icon' width={16} height={16} />
						<Typography sx={{ ml: 1 }}>Learn</Typography>
					</IconButton>
					<IconButton
						href='https://vercel.com/templates'
						target='_blank'
						rel='noopener noreferrer'
						color='primary'>
						<Image src='/window.svg' alt='Window icon' width={16} height={16} />
						<Typography sx={{ ml: 1 }}>Examples</Typography>
					</IconButton>
					<IconButton
						href='https://nextjs.org'
						target='_blank'
						rel='noopener noreferrer'
						color='primary'>
						<Image src='/globe.svg' alt='Globe icon' width={16} height={16} />
						<Typography sx={{ ml: 1 }}>Go to nextjs.org →</Typography>
					</IconButton>
				</footer>
			</div>
		</>
	);
}
