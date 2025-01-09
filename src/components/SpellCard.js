import {
	Card,
	CardContent,
	Typography,
	Chip,
	Box,
	Modal,
	Divider,
	IconButton,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./SpellCard.module.css";
import { useState } from "react";

const SpellCard = ({ spell }) => {
	const [open, setOpen] = useState(false);

	const getSchoolColor = (school) => {
		const schoolColors = {
			Abjuration: "#4299e1",
			Conjuration: "#9f7aea",
			Divination: "#38b2ac",
			Enchantment: "#ed64a6",
			Evocation: "#f56565",
			Illusion: "#667eea",
			Necromancy: "#1a202c",
			Transmutation: "#48bb78",
		};
		return schoolColors[school] || "#718096";
	};

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<>
			<Card
				className={styles.spellCard}
				sx={{
					bgcolor: "#1a1a1a",
					position: "relative",
					cursor: "pointer",
				}}
				onClick={handleOpen}>
				<Box
					sx={{
						bgcolor: getSchoolColor(spell.school.name),
						p: 1,
						borderBottom: "2px solid rgba(255,255,255,0.1)",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}>
					<Typography
						variant='subtitle2'
						sx={{
							fontWeight: "bold",
							fontSize: "0.7rem",
							color: "white",
							flex: 1,
							textAlign: "left",
						}}>
						{spell.name}
					</Typography>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							border: "2px solid #333",
							borderRadius: "5px",
							padding: "5px",
							bgcolor: "black",
						}}>
						<Typography
							variant='subtitle2'
							sx={{
								fontWeight: "bold",
								fontSize: "0.7rem",
								color: "white",
								marginRight: "2px",
							}}>
							Level
						</Typography>
						<Typography
							variant='subtitle2'
							sx={{
								fontWeight: "bold",
								fontSize: "0.7rem",
								color: "white",
								height: "20px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}>
							{spell.level === 0 ? "C" : spell.level}
						</Typography>
					</Box>
				</Box>

				<CardContent sx={{ p: "8px !important" }}>
					<Box sx={{ mb: 1 }}>
						<Typography
							variant='caption'
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 0.5,
								fontSize: "0.6rem",
								mb: 0.5,
							}}>
							<AccessTimeIcon sx={{ fontSize: "0.8rem" }} />
							{spell.casting_time}
						</Typography>
						<Typography
							variant='caption'
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 0.5,
								fontSize: "0.6rem",
								mb: 0.5,
							}}>
							<GpsFixedIcon sx={{ fontSize: "0.8rem" }} />
							{spell.range}
						</Typography>
						<Typography
							variant='caption'
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 0.5,
								fontSize: "0.6rem",
							}}>
							<HourglassEmptyIcon sx={{ fontSize: "0.8rem" }} />
							{spell.duration}
						</Typography>
					</Box>

					<Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 1 }}>
						{spell.components.map((comp) => (
							<Chip
								key={comp}
								label={comp}
								size='small'
								variant='outlined'
								sx={{
									height: "16px",
									fontSize: "0.6rem",
									borderColor: "rgba(255,255,255,0.3)",
									"& .MuiChip-label": { px: 1 },
								}}
							/>
						))}
					</Box>

					{/* <Typography
						variant='caption'
						sx={{
							display: "block",
							fontSize: "0.6rem",
							color: "rgba(255,255,255,0.7)",
							lineHeight: 1.2,
						}}>
						{spell.desc[0]}
					</Typography> */}
				</CardContent>
			</Card>

			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby='spell-modal-title'
				aria-describedby='spell-modal-description'>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: { xs: "90%", sm: "600px" },
						maxHeight: "90vh",
						bgcolor: "#1a1a1a",
						border: "2px solid #333",
						borderRadius: 2,
						boxShadow: 24,
						display: "flex",
						flexDirection: "column",
					}}>
					<Box
						sx={{
							bgcolor: getSchoolColor(spell.school.name),
							p: 2,
							borderTopLeftRadius: 8,
							borderTopRightRadius: 8,
							position: "sticky",
							top: 0,
							zIndex: 1,
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							flexShrink: 0,
						}}>
						<Typography variant='h5' component='h2' sx={{ color: "white" }}>
							{spell.name}
						</Typography>
						<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
							<Chip
								label={spell.level === 0 ? "Cantrip" : `Level ${spell.level}`}
								sx={{
									bgcolor: "#ffd700",
									color: "#1a1a1a",
									fontWeight: "bold",
								}}
							/>
							<IconButton
								onClick={handleClose}
								sx={{
									color: "white",
									"&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
								}}>
								<CloseIcon />
							</IconButton>
						</Box>
					</Box>

					<Box
						sx={{
							overflowY: "auto",
							flex: 1,
							p: 4,
							"&::-webkit-scrollbar": {
								width: "8px",
							},
							"&::-webkit-scrollbar-track": {
								bgcolor: "rgba(0,0,0,0.1)",
								borderRadius: "4px",
							},
							"&::-webkit-scrollbar-thumb": {
								bgcolor: "rgba(255,255,255,0.2)",
								borderRadius: "4px",
								"&:hover": {
									bgcolor: "rgba(255,255,255,0.3)",
								},
							},
						}}>
						<Box sx={{ mb: 3 }}>
							<Typography variant='subtitle1' sx={{ mb: 1, color: "grey.300" }}>
								<strong>School:</strong> {spell.school.name}
							</Typography>
							<Typography variant='subtitle1' sx={{ mb: 1, color: "grey.300" }}>
								<strong>Casting Time:</strong> {spell.casting_time}
							</Typography>
							<Typography variant='subtitle1' sx={{ mb: 1, color: "grey.300" }}>
								<strong>Range:</strong> {spell.range}
							</Typography>
							<Typography variant='subtitle1' sx={{ mb: 1, color: "grey.300" }}>
								<strong>Duration:</strong> {spell.duration}
							</Typography>
						</Box>

						<Box sx={{ mb: 3 }}>
							<Typography variant='subtitle1' sx={{ mb: 1, color: "grey.300" }}>
								<strong>Components:</strong>
							</Typography>
							<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
								{spell.components.map((comp) => (
									<Chip
										key={comp}
										label={comp}
										variant='outlined'
										sx={{ color: "grey.300" }}
									/>
								))}
							</Box>
						</Box>

						<Divider sx={{ my: 2, bgcolor: "grey.800" }} />

						<Typography variant='h6' sx={{ mb: 2, color: "grey.300" }}>
							Description
						</Typography>
						{spell.desc.map((paragraph, index) => (
							<Typography
								key={index}
								variant='body1'
								sx={{
									mb: 2,
									color: "grey.300",
									whiteSpace: "pre-line",
								}}>
								{paragraph}
							</Typography>
						))}

						{spell.higher_level && (
							<>
								<Typography
									variant='h6'
									sx={{ mt: 3, mb: 2, color: "grey.300" }}>
									At Higher Levels
								</Typography>
								{spell.higher_level.map((text, index) => (
									<Typography
										key={index}
										variant='body1'
										sx={{
											mb: 2,
											color: "grey.300",
											whiteSpace: "pre-line",
										}}>
										{text}
									</Typography>
								))}
							</>
						)}
					</Box>
				</Box>
			</Modal>
		</>
	);
};

export default SpellCard;
