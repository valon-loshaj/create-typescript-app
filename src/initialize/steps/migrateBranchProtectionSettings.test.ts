import { Octokit } from "octokit";
import { SpyInstance, describe, expect, it, vi } from "vitest";

import { migrateBranchProtectionSettings } from "./migrateBranchProtectionSettings.js";

const createMockOctokit = (request: SpyInstance) =>
	({
		request,
	}) as unknown as Octokit;

const stubValues = { owner: "", repository: "" };

describe("migrateBranchProtectionSettings", () => {
	it("returns false when the request receives a 403 response", async () => {
		const mockRequest = vi.fn().mockRejectedValue({ status: 403 });

		const actual = await migrateBranchProtectionSettings(
			createMockOctokit(mockRequest),
			stubValues,
		);

		expect(actual).toBe(false);
	});

	it("throws the error when the request throws with a non-403 response", async () => {
		const error = { status: 404 };
		const mockRequest = vi.fn().mockRejectedValue(error);

		await expect(() =>
			migrateBranchProtectionSettings(
				createMockOctokit(mockRequest),
				stubValues,
			),
		).rejects.toBe(error);
	});
});