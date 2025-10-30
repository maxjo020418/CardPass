import { createMemo, createSignal, For } from "solid-js";
import { A } from "@solidjs/router";
import { useI18n } from "~/contexts/i18n";

interface Job {
	id: string;
	title: string;
	company: string;
	location: string;
	type: string;
	bounty: number;
	posted: string;
	description: string;
	tags: string[];
}

export default function Jobs() {
	const { t, locale } = useI18n();

	// Make jobs reactive based on locale
	const jobs = createMemo(() => {
		const jobList = t("jobs.jobList") as unknown as Job[];
		return jobList || [];
	});

	const [searchTerm, setSearchTerm] = createSignal("");
	const [filterType, setFilterType] = createSignal("all");

	const filteredJobs = () => {
		return jobs().filter((job) => {
			const matchesSearch =
				job.title.toLowerCase().includes(searchTerm().toLowerCase()) ||
				job.company.toLowerCase().includes(searchTerm().toLowerCase()) ||
				job.tags.some((tag) =>
					tag.toLowerCase().includes(searchTerm().toLowerCase()),
				);

			const matchesType =
				filterType() === "all" ||
				(locale() === "ko"
					? job.type === filterType()
					: job.type.toLowerCase() === filterType().toLowerCase());

			return matchesSearch && matchesType;
		});
	};

	return (
		<main class="min-h-screen bg-gradient-to-b from-gray-900 to-black">
			<div class="container mx-auto px-4 py-12">
				<div class="mb-12">
					<h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
						{t("jobs.title")}
					</h1>
					<p class="text-xl text-gray-400">{t("jobs.subtitle")}</p>
				</div>

				{/* Search and Filter */}
				<div class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 mb-8">
					<div class="flex flex-col md:flex-row gap-4">
						<div class="flex-1">
							<input
								type="text"
								placeholder={t("jobs.searchPlaceholder")}
								value={searchTerm()}
								onInput={(e) => setSearchTerm(e.currentTarget.value)}
								class="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
							/>
						</div>
						<select
							value={filterType()}
							onChange={(e) => setFilterType(e.currentTarget.value)}
							class="px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
						>
							<option value="all">{t("jobs.filterAll")}</option>
							<option value={locale() === "ko" ? "정규직" : "full-time"}>
								{t("jobs.filterFullTime")}
							</option>
							<option value={locale() === "ko" ? "계약직" : "contract"}>
								{t("jobs.filterContract")}
							</option>
							<option value={locale() === "ko" ? "프리랜서" : "freelance"}>
								{t("jobs.filterFreelance")}
							</option>
						</select>
					</div>
				</div>

				{/* Job Listings */}
				<div class="grid gap-6">
					<For each={filteredJobs()}>
						{(job) => (
							<div class="group bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-violet-500/50 p-6 transition-all hover:shadow-xl hover:shadow-violet-500/10">
								<div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
									<div class="flex-1">
										<div class="flex items-start justify-between mb-3">
											<div>
												<A href={`/jobs/${job.id}`}>
													<h2 class="text-2xl font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">
														{job.title}
													</h2>
												</A>
												<div class="flex flex-wrap items-center gap-3 text-gray-400 text-sm">
													<span class="font-medium text-gray-300">
														{job.company}
													</span>
													<span>•</span>
													<span>{job.location}</span>
													<span>•</span>
													<span>{job.type}</span>
													<span>•</span>
													<span>{job.posted}</span>
												</div>
											</div>
										</div>

										<p class="text-gray-400 mb-4">{job.description}</p>

										<div class="flex flex-wrap gap-2 mb-4">
											<For each={job.tags}>
												{(tag) => (
													<span class="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full border border-gray-700">
														{tag}
													</span>
												)}
											</For>
										</div>
									</div>

									<div class="flex flex-col items-end gap-3">
										<div class="text-right">
											<p class="text-sm text-gray-400 mb-1">
												{t("jobs.bountyLabel")}
											</p>
											<p class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
												{job.bounty} USDC
											</p>
										</div>

										<div class="flex gap-2">
											<A
												href={`/jobs/${job.id}`}
												class="px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors inline-block"
											>
												{t("jobs.viewDetails")}
											</A>
											<A
												href={`/jobs/${job.id}`}
												class="px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-violet-500/25 transition-all inline-block"
											>
												{t("jobs.applyButton")}
											</A>
										</div>
									</div>
								</div>
							</div>
						)}
					</For>
				</div>

				{filteredJobs().length === 0 && (
					<div class="text-center py-20">
						<p class="text-gray-400 text-lg">{t("jobs.noResults")}</p>
					</div>
				)}
			</div>
		</main>
	);
}
