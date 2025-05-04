'use client'

import {
	Archive as ArchiveIcon,
	Delete as DeleteIcon,
	Description as DocIcon,
	InsertDriveFile as FileIcon,
	Folder as FolderIcon,
	Home as HomeIcon,
	Logout as LogoutIcon,
	CreateNewFolder as NewFolderIcon,
	OpenInNew as OpenIcon,
	DriveFileRenameOutline as RenameIcon,
	Share as ShareIcon,
	CloudUpload as UploadIcon,
} from '@mui/icons-material'
import {
	Box,
	Breadcrumbs,
	Button,
	Card,
	CardContent,
	CircularProgress,
	Divider,
	IconButton,
	Link,
	Menu,
	MenuItem,
	TextField,
	Typography,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { pdfjs } from 'react-pdf'

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface Folder {
	id: string
	name: string
	parentId: string | null
}

interface StoredFile {
	id: string
	name: string
	size: number
	mimeType: string
	folderId: string | null
}

interface User {
	id: string
	email?: string
	name?: string
}

// FilePreview component for rendering previews/icons
function FilePreview({ file, apiUrl }: { file: StoredFile; apiUrl: string }) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [pdfLoaded, setPdfLoaded] = useState(false)
	const [pdfError, setPdfError] = useState<string | null>(null)
	const [imageError, setImageError] = useState(false)

	const isImage = file.mimeType.startsWith('image/')
	const isPdf =
		file.mimeType === 'application/pdf' ||
		file.name.toLowerCase().endsWith('.pdf')
	const isDoc = [
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	].includes(file.mimeType)
	const isArchive = [
		'application/zip',
		'application/x-rar-compressed',
	].includes(file.mimeType)

	// Render PDF thumbnail
	useEffect(() => {
		if (!isPdf || !canvasRef.current) return

		console.log('Attempting to render PDF preview for file:', {
			id: file.id,
			name: file.name,
			mimeType: file.mimeType,
		})

		const renderPdf = async () => {
			try {
				const res = await fetch(`${apiUrl}/files/download/${file.id}`, {
					credentials: 'include',
					headers: {
						Accept: 'application/pdf',
					},
				})
				console.log('PDF fetch response:', { status: res.status, ok: res.ok })
				if (!res.ok) throw new Error(`HTTP ${res.status}`)
				const arrayBuffer = await res.arrayBuffer()
				const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
				const page = await pdf.getPage(1)
				const viewport = page.getViewport({ scale: 0.3 }) // Small scale for thumbnail
				const canvas = canvasRef.current!
				const context = canvas.getContext('2d')!
				if (!context) throw new Error('Failed to get canvas context')
				canvas.width = viewport.width
				canvas.height = viewport.height
				await page.render({ canvasContext: context, viewport }).promise
				setPdfLoaded(true)
				console.log('PDF rendered successfully:', {
					id: file.id,
					name: file.name,
				})
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : String(err)
				console.error('PDF render error:', errorMessage)
				setPdfError(errorMessage)
			}
		}

		renderPdf()
	}, [isPdf, file.id, file.name, file.mimeType, apiUrl])

	if (isImage) {
		return (
			<Box
				component='img'
				src={`${apiUrl}/files/download/${file.id}`}
				onError={() => setImageError(true)}
				sx={{ width: 60, height: 60, objectFit: 'contain', mt: 1 }}
				style={{ display: imageError ? 'none' : 'block' }}
			/>
		)
	}

	if (isPdf) {
		return (
			<Box
				sx={{
					mt: 1,
					width: 60,
					height: 60,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				{pdfLoaded ? (
					<canvas
						ref={canvasRef}
						style={{ maxWidth: '100%', maxHeight: '100%' }}
					/>
				) : pdfError ? (
					<FileIcon fontSize='large' color='primary' />
				) : (
					<CircularProgress size={24} />
				)}
			</Box>
		)
	}

	if (isDoc) {
		return <DocIcon fontSize='large' sx={{ mt: 1 }} color='primary' />
	}

	if (isArchive) {
		return <ArchiveIcon fontSize='large' sx={{ mt: 1 }} color='primary' />
	}

	return <FileIcon fontSize='large' sx={{ mt: 1 }} />
}

export default function FileManager() {
	const API_URL = process.env.NEXT_PUBLIC_API_URL!
	const router = useRouter()

	// Fetch user data from /api/users/me
	const fetchUser = async (): Promise<User | null> => {
		try {
			const res = await fetch(`${API_URL}/users/me`, {
				credentials: 'include',
				cache: 'no-store',
			})
			if (!res.ok) {
				if (res.status === 401) {
					console.log('fetchUser: Unauthorized, redirecting to /login')
					router.push('/login')
				}
				throw new Error(`Failed to fetch user: ${res.status}`)
			}
			const user = await res.json()
			console.log('Fetched user:', user)
			return user
		} catch (err) {
			console.error('fetchUser error:', err)
			return null
		}
	}

	// Clear cookie and redirect to login
	function handleLogout() {
		document.cookie =
			'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
		console.log('Cleared access_token cookie')
		router.push('/login')
	}

	// Fetch options
	function makeFetchOpts(extra: RequestInit = {}): RequestInit {
		return {
			...extra,
			credentials: 'include',
			headers: {
				...(extra.headers || {}),
			},
			cache: 'no-store',
		}
	}

	const [user, setUser] = useState<User | null>(null)
	const [folders, setFolders] = useState<Folder[]>([])
	const [files, setFiles] = useState<StoredFile[]>([])
	const [currentFolder, setCurrentFolder] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [selectedFiles, setSelectedFiles] = useState<string[]>([]) // Track selected file IDs

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const [anchorPosition, setAnchorPosition] = useState<{
		top: number
		left: number
	} | null>(null)
	const [menuContext, setMenuContext] = useState<
		| { type: 'file'; item: StoredFile }
		| { type: 'folder'; item: Folder }
		| { type: 'background' }
		| { type: 'multiple'; items: StoredFile[] }
		| null
	>(null)

	const [newFolderName, setNewFolderName] = useState('')
	const [creatingFolder, setCreatingFolder] = useState(false)

	// Fetch user on mount
	useEffect(() => {
		fetchUser().then(fetchedUser => {
			if (fetchedUser) {
				setUser(fetchedUser)
			} else {
				setError(
					'Не удалось загрузить данные пользователя. Попробуйте выйти и войти снова.'
				)
			}
		})
	}, [])

	// Fetch folder and file structure
	const fetchTree = async () => {
		if (!user) {
			setError(
				'Пользователь не аутентифицирован. Пожалуйста, войдите в систему.'
			)
			return
		}
		setLoading(true)
		try {
			const userId = user.id
			console.log('fetchTree called with:', {
				userId,
				currentFolder: currentFolder ?? 'null',
			})
			const opts = makeFetchOpts()
			const [fRes, fileRes] = await Promise.all([
				fetch(`${API_URL}/folders`, opts),
				fetch(`${API_URL}/files?folderId=${currentFolder ?? ''}`, opts),
			])
			if (!fRes.ok || !fileRes.ok) {
				console.error('Fetch error:', {
					folders: { status: fRes.status, statusText: fRes.statusText },
					files: { status: fileRes.status, statusText: fileRes.statusText },
				})
				throw new Error('Failed to fetch folders or files')
			}
			const foldersData = await fRes.json()
			const filesData = await fileRes.json() // Fix: Use fileRes instead of fRes
			console.log('Fetched data:', {
				folders: foldersData.map((f: Folder) => ({
					id: f.id,
					name: f.name,
					parentId: f.parentId,
				})),
				files: filesData.map((f: StoredFile) => ({
					id: f.id,
					name: f.name,
					mimeType: f.mimeType,
					size: f.size,
					folderId: f.folderId,
				})),
			})
			setFolders(foldersData)
			setFiles(
				filesData.map((f: StoredFile) => {
					let decodedName = f.name || 'Без имени'
					try {
						decodedName = decodeURIComponent(f.name || 'Без имени')
					} catch {
						console.warn(`Failed to decode file name: ${f.name}`)
					}
					return { ...f, name: decodedName }
				})
			)
			setError(null)
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : String(err)
			console.error('Fetch tree error:', err)
			setError(`Ошибка при загрузке структуры: ${errorMessage}`)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (user) {
			fetchTree()
		}
	}, [user, currentFolder])

	// Handle file selection
	const handleFileSelect = (fileId: string, e: MouseEvent<HTMLElement>) => {
		e.stopPropagation()
		if (e.ctrlKey || e.metaKey) {
			// Ctrl+Click or Cmd+Click to toggle selection
			setSelectedFiles(prev =>
				prev.includes(fileId)
					? prev.filter(id => id !== fileId)
					: [...prev, fileId]
			)
		} else if (e.shiftKey) {
			// Shift+Click to select range
			const fileIds = files.map(f => f.id)
			const currentIndex = fileIds.indexOf(fileId)
			const lastSelectedIndex = selectedFiles.length
				? fileIds.indexOf(selectedFiles[selectedFiles.length - 1])
				: currentIndex
			const start = Math.min(currentIndex, lastSelectedIndex)
			const end = Math.max(currentIndex, lastSelectedIndex)
			const range = fileIds.slice(start, end + 1)
			setSelectedFiles(Array.from(new Set([...selectedFiles, ...range])))
		} else {
			// Single click to select only this file
			setSelectedFiles([fileId])
		}
	}

	// Clear selection on background click
	const handleBackgroundClick = () => {
		setSelectedFiles([])
	}

	// Handle file upload from context menu
	const handleContextUpload = async (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files?.length) return
		await handleUpload(Array.from(e.target.files))
		closeMenu()
	}

	// Drag-and-drop
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: (accepted: File[]) => handleUpload(accepted),
		noClick: true,
		accept: {
			'image/*': ['.png', '.jpg', '.jpeg'],
			'application/pdf': ['.pdf'],
			'application/msword': ['.doc'],
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
				['.docx'],
			'application/zip': ['.zip'],
			'application/x-rar-compressed': ['.rar'],
		},
	})

	// --- CRUD operations ---
	const handleCreateFolder = async () => {
		if (!newFolderName.trim()) return
		setCreatingFolder(true)
		try {
			const res = await fetch(
				`${API_URL}/folders`,
				makeFetchOpts({
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: newFolderName,
						parentId: currentFolder ?? undefined,
					}),
				})
			)
			if (!res.ok) throw new Error()
			setNewFolderName('')
			await fetchTree()
		} catch {
			alert('Не удалось создать папку')
		} finally {
			setCreatingFolder(false)
		}
	}

	const handleUpload = async (fileList: File[]) => {
		console.log(
			'Uploading files:',
			fileList.map(f => f.name)
		)
		const form = new FormData()
		fileList.forEach(f => form.append('file', f))
		if (currentFolder) form.append('folderId', currentFolder)
		try {
			const res = await fetch(
				`${API_URL}/files/upload`,
				makeFetchOpts({ method: 'POST', body: form })
			)
			if (!res.ok) throw new Error(`HTTP ${res.status}`)
			await fetchTree()
		} catch (err) {
			console.error('Upload error:', err)
			alert('Ошибка при загрузке файлов')
		}
	}

	const handleMoveFile = async (fileIds: string[], targetFolderId: string) => {
		if (!fileIds.length) return
		try {
			await Promise.all(
				fileIds.map(fileId =>
					fetch(
						`${API_URL}/files/${fileId}`,
						makeFetchOpts({
							method: 'PATCH',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ folderId: targetFolderId }),
						})
					)
				)
			)
			setSelectedFiles([])
			fetchTree()
		} catch {
			alert('Не удалось переместить файлы')
		}
	}

	const handleMoveFolder = async (folderId: string, targetFolderId: string) => {
		if (!folderId) return
		try {
			await fetch(
				`${API_URL}/folders/${folderId}`,
				makeFetchOpts({
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ parentId: targetFolderId }),
				})
			)
			fetchTree()
		} catch {
			alert('Не удалось переместить папку')
		}
	}

	const handleRename = async () => {
		if (
			!menuContext ||
			menuContext.type === 'background' ||
			menuContext.type === 'multiple'
		)
			return
		const { id, name } = menuContext.item
		const newName = prompt(
			`Новое имя ${menuContext.type === 'file' ? 'файла' : 'папки'}`,
			name
		)
		if (!newName || !newName.trim()) return
		try {
			const url =
				menuContext.type === 'file'
					? `${API_URL}/files/${id}`
					: `${API_URL}/folders/${id}`
			await fetch(
				url,
				makeFetchOpts({
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ name: newName }),
				})
			)
			fetchTree()
		} catch {
			alert('Не удалось переименовать')
		}
		closeMenu()
	}

	const handleDelete = async () => {
		if (!menuContext || menuContext.type === 'background') return
		try {
			if (menuContext.type === 'multiple') {
				await Promise.all(
					menuContext.items.map(item =>
						fetch(
							`${API_URL}/files/${item.id}`,
							makeFetchOpts({ method: 'DELETE' })
						)
					)
				)
			} else {
				const url =
					menuContext.type === 'file'
						? `${API_URL}/files/${menuContext.item.id}`
						: `${API_URL}/folders/${menuContext.item.id}`
				const res = await fetch(url, makeFetchOpts({ method: 'DELETE' }))
				if (!res.ok) throw new Error()
			}
			setSelectedFiles([])
			fetchTree()
		} catch {
			alert('Не удалось удалить')
		}
		closeMenu()
	}

	const handleDownload = () => {
		if (!menuContext || menuContext.type !== 'file') return
		window.open(`${API_URL}/files/download/${menuContext.item.id}`, '_blank')
		closeMenu()
	}

	const handleFileShare = async () => {
		if (!menuContext || menuContext.type !== 'file') return
		try {
			const res = await fetch(
				`${API_URL}/files/share/${menuContext.item.id}`,
				makeFetchOpts({ method: 'POST' })
			)
			if (!res.ok) throw new Error()
			const json = await res.json()
			prompt(
				'Публичная ссылка, скопируйте:',
				`${API_URL}/files/public/${json.publicLink}`
			)
		} catch {
			alert('Не удалось создать ссылку')
		}
		closeMenu()
	}

	const handleFolderShare = async () => {
		if (!menuContext || menuContext.type !== 'folder') return
		try {
			const res = await fetch(
				`${API_URL}/folders/share/${menuContext.item.id}`,
				makeFetchOpts({ method: 'POST' })
			)
			if (!res.ok) throw new Error()
			const json = await res.json()
			prompt(
				'Публичная ссылка, скопируйте:',
				`${API_URL}/folders/public/${json.publicLink}`
			)
		} catch {
			alert('Не удалось создать ссылку')
		}
		closeMenu()
	}

	// Breadcrumbs
	const getBreadcrumbPath = () => {
		const path: { id: string | null; name: string }[] = [
			{ id: null, name: 'Home' },
		]
		const folder = folders.find(x => x.id === currentFolder)
		if (!folder) return path
		let currentFolderRecord: Folder | undefined = folder
		while (currentFolderRecord) {
			path.unshift({
				id: currentFolderRecord.id,
				name: currentFolderRecord.name,
			})
			currentFolderRecord = folders.find(
				x => x.id === currentFolderRecord?.parentId
			)
		}
		return path
	}

	// Open context menu
	const openMenu = (
		e: MouseEvent<HTMLElement>,
		ctx:
			| { type: 'file'; item: StoredFile }
			| { type: 'folder'; item: Folder }
			| { type: 'background' }
			| { type: 'multiple'; items: StoredFile[] }
	) => {
		e.preventDefault()
		e.stopPropagation()
		setAnchorEl(e.currentTarget)
		setAnchorPosition({ top: e.clientY, left: e.clientX })
		setMenuContext(ctx)
	}

	const closeMenu = () => {
		setAnchorEl(null)
		setAnchorPosition(null)
		setMenuContext(null)
	}

	return (
		<Box
			sx={{ height: '100%', p: 2 }}
			onContextMenu={e => openMenu(e, { type: 'background' })}
			onClick={handleBackgroundClick}
		>
			{/* Debug: Display userId */}
			<Typography variant='caption' color='text.secondary' sx={{ mb: 1 }}>
				User ID: {user?.id || 'Не удалось извлечь userId'}
			</Typography>

			{/* Toolbar */}
			<Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
				<TextField
					size='small'
					placeholder='Новая папка…'
					value={newFolderName}
					onChange={e => setNewFolderName(e.target.value)}
				/>
				<IconButton
					color='primary'
					onClick={handleCreateFolder}
					disabled={creatingFolder}
				>
					<NewFolderIcon />
				</IconButton>
				<Button variant='outlined' startIcon={<UploadIcon />} component='label'>
					Загрузить
					<input
						hidden
						type='file'
						multiple
						onChange={e =>
							e.target.files && handleUpload(Array.from(e.target.files))
						}
					/>
				</Button>
				<Button
					variant='outlined'
					startIcon={<LogoutIcon />}
					onClick={handleLogout}
					color='error'
				>
					Выйти
				</Button>
			</Box>

			{/* Breadcrumbs */}
			<Breadcrumbs sx={{ mb: 2 }}>
				{getBreadcrumbPath().map((it, i, arr) => (
					<Link
						key={it.id || 'home' + i}
						underline='hover'
						color={i === arr.length - 1 ? 'text.primary' : 'inherit'}
						onClick={() => setCurrentFolder(it.id)}
						sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
					>
						{it.id === null && <HomeIcon fontSize='small' sx={{ mr: 0.5 }} />}
						{it.name}
					</Link>
				))}
			</Breadcrumbs>

			<Divider sx={{ mb: 2 }} />

			{/* Main area */}
			<Box
				sx={{ flex: 1, position: 'relative', overflow: 'auto' }}
				{...getRootProps()}
			>
				<input {...getInputProps()} />
				{isDragActive && (
					<Box
						sx={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							bgcolor: 'action.hover',
							opacity: 0.7,
							zIndex: 10,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<UploadIcon sx={{ fontSize: 48 }} />
						<Typography sx={{ ml: 1 }}>Перетащите файлы</Typography>
					</Box>
				)}

				{loading ? (
					<Box sx={{ textAlign: 'center', py: 4 }}>
						<CircularProgress />
					</Box>
				) : error ? (
					<Typography color='error' sx={{ textAlign: 'center', py: 4 }}>
						{error}
					</Typography>
				) : folders.filter(f => f.parentId === currentFolder).length === 0 &&
				  files.length === 0 ? (
					<Typography sx={{ textAlign: 'center', py: 4 }}>
						Папка пуста. Если файлы не отображаются, проверьте userId в логах и
						базе данных.
					</Typography>
				) : (
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
						{/* Folders */}
						{folders
							.filter(f => f.parentId === currentFolder)
							.map(f => (
								<Card
									key={f.id}
									draggable
									onDragStart={e => {
										e.dataTransfer.setData('type', 'folder')
										e.dataTransfer.setData('id', f.id)
									}}
									onDragOver={e => e.preventDefault()}
									onDrop={e => {
										e.preventDefault()
										const type = e.dataTransfer.getData('type')
										const id = e.dataTransfer.getData('id')
										if (type === 'file') {
											if (selectedFiles.length > 0) {
												handleMoveFile(selectedFiles, f.id)
											} else {
												handleMoveFile([id], f.id)
											}
										}
										if (type === 'folder' && id !== f.id)
											handleMoveFolder(id, f.id)
									}}
									onClick={() => {
										setSelectedFiles([])
										setCurrentFolder(f.id)
									}}
									onContextMenu={e => openMenu(e, { type: 'folder', item: f })}
									sx={{
										width: 160,
										cursor: 'pointer',
										transition: 'all .2s',
										'&:hover': { boxShadow: 6, transform: 'translateY(-2px)' },
									}}
								>
									<CardContent
										sx={{
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
										}}
									>
										<FolderIcon fontSize='large' color='primary' />
										<Typography sx={{ mt: 1 }}>{f.name}</Typography>
									</CardContent>
								</Card>
							))}

						{/* Files */}
						{files.map(f => (
							<Card
								key={f.id}
								draggable
								onDragStart={e => {
									e.dataTransfer.setData('type', 'file')
									e.dataTransfer.setData('id', f.id)
									if (selectedFiles.includes(f.id)) {
										// Drag all selected files
										e.dataTransfer.setData('ids', JSON.stringify(selectedFiles))
									}
								}}
								onClick={e => handleFileSelect(f.id, e)}
								onContextMenu={e => {
									if (
										selectedFiles.length > 1 &&
										selectedFiles.includes(f.id)
									) {
										const selectedItems = files.filter(file =>
											selectedFiles.includes(file.id)
										)
										openMenu(e, { type: 'multiple', items: selectedItems })
									} else {
										setSelectedFiles([f.id])
										openMenu(e, { type: 'file', item: f })
									}
								}}
								sx={{
									width: 160,
									cursor: 'pointer',
									transition: 'all .2s',
									border: selectedFiles.includes(f.id)
										? '2px solid blue'
										: 'none',
									'&:hover': { boxShadow: 6, transform: 'translateY(-2px)' },
								}}
							>
								<CardContent
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
									}}
								>
									<FilePreview file={f} apiUrl={API_URL} />
									<Typography sx={{ mt: 1, textAlign: 'center' }}>
										{f.name}
									</Typography>
									<Typography variant='caption' color='text.secondary'>
										{(f.size / 1024).toFixed(1)} KB
									</Typography>
								</CardContent>
							</Card>
						))}
					</Box>
				)}

				{/* Context menu */}
				<Menu
					anchorReference='anchorPosition'
					anchorPosition={
						anchorPosition
							? { top: anchorPosition.top, left: anchorPosition.left }
							: undefined
					}
					open={Boolean(anchorEl) && Boolean(anchorPosition)}
					onClose={closeMenu}
				>
					{/* Background */}
					{menuContext?.type === 'background' && (
						<>
							<MenuItem
								onClick={() => {
									setNewFolderName('Новая папка')
									handleCreateFolder()
									closeMenu()
								}}
							>
								<NewFolderIcon fontSize='small' sx={{ mr: 1 }} />
								Новая папка
							</MenuItem>
							<MenuItem component='label'>
								<UploadIcon fontSize='small' sx={{ mr: 1 }} />
								Загрузить файл
								<input
									type='file'
									hidden
									multiple
									onChange={handleContextUpload}
								/>
							</MenuItem>
						</>
					)}

					{/* Folder */}
					{menuContext?.type === 'folder' && (
						<>
							<MenuItem
								onClick={() => {
									setCurrentFolder(menuContext.item.id)
									closeMenu()
								}}
							>
								<OpenIcon fontSize='small' sx={{ mr: 1 }} />
								Открыть
							</MenuItem>
							<MenuItem onClick={handleFolderShare}>
								<ShareIcon fontSize='small' sx={{ mr: 1 }} />
								Поделиться
							</MenuItem>
							<MenuItem onClick={handleRename}>
								<RenameIcon fontSize='small' sx={{ mr: 1 }} />
								Переименовать
							</MenuItem>
							<MenuItem onClick={handleDelete}>
								<Typography color='error'>Удалить</Typography>
							</MenuItem>
						</>
					)}

					{/* File */}
					{menuContext?.type === 'file' && (
						<>
							<MenuItem onClick={handleDownload}>
								<OpenIcon fontSize='small' sx={{ mr: 1 }} />
								Открыть
							</MenuItem>
							<MenuItem onClick={handleDownload}>
								<Typography>Скачать</Typography>
							</MenuItem>
							<MenuItem onClick={handleFileShare}>
								<ShareIcon fontSize='small' sx={{ mr: 1 }} />
								Поделиться
							</MenuItem>
							<MenuItem onClick={handleRename}>
								<RenameIcon fontSize='small' sx={{ mr: 1 }} />
								Переименовать
							</MenuItem>
							<MenuItem onClick={handleDelete}>
								<Typography color='error'>Удалить</Typography>
							</MenuItem>
						</>
					)}

					{/* Multiple Files */}
					{menuContext?.type === 'multiple' && (
						<>
							<MenuItem onClick={handleDelete}>
								<DeleteIcon fontSize='small' sx={{ mr: 1 }} color='error' />
								<Typography color='error'>
									Удалить ({menuContext.items.length})
								</Typography>
							</MenuItem>
						</>
					)}
				</Menu>
			</Box>
		</Box>
	)
}
