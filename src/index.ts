import { ethers } from "ethers";

export const ChamaVaultABI = [
  "function createChama(string _name, address _token, uint256 _contributionAmount, uint256 _frequency, uint256 _maxMembers) returns (uint256)",
  "function joinChama(uint256 _chamaId)",
  "function contribute(uint256 _chamaId)",
  "function getChamaMembers(uint256 _chamaId) view returns (address[])",
  "function getChamaInfo(uint256 _chamaId) view returns (string name, address creator, uint256 contributionAmount, uint256 maxMembers, uint256 currentRound, uint256 totalRounds, uint256 memberCount, uint8 state)",
  "function hasContributed(uint256 _chamaId, uint256 _round, address _member) view returns (bool)",
  "function getRoundRecipient(uint256 _chamaId, uint256 _round) view returns (address)",
  "function getMemberReputation(uint256 _chamaId, address _member) view returns (uint256)",
  "function getGlobalReputation(address _member) view returns (uint256)",
  "function getMemberChamas(address _member) view returns (uint256[])",
  "function chamaCount() view returns (uint256)"
];

export const ChamaMinerABI = [
  "function deposit(uint256 amount)",
  "function withdraw(uint256 amount)",
  "function harvest()",
  "function upgradeTier(uint8 newTier)",
  "function getMultiplier(address account) view returns (uint256)",
  "function pendingRewards(address account) view returns (uint256)",
  "function balances(address account) view returns (uint256)",
  "function rewardRate() view returns (uint256)",
  "function liteUpgradeCost() view returns (uint256)",
  "function proUpgradeCost() view returns (uint256)",
  "function userTiers(address account) view returns (uint8)"
];

export const ChamaQuestsABI = [
  "function checkIn()",
  "function stats(address user) view returns (uint256 xp, uint256 streak, uint256 lastCheckIn, uint256 totalClaimed)",
  "function getNextReward(address account) view returns (uint256 chamaAmount, uint256 dayInCycle)",
  "function isUser(address account) view returns (bool)",
  "function allUsers(uint256 index) view returns (address)"
];

export const ChamaTokenSaleABI = [
  "function buyWithCUSD(uint256 cusdAmount)",
  "function buyWithCELO() payable",
  "function totalChamaSold() view returns (uint256)",
  "function celoPriceUsd() view returns (uint256)",
  "function totalCusdRaised() view returns (uint256)",
  "function totalCeloRaised() view returns (uint256)"
];

export const ERC20ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function mint(address to, uint256 amount)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)"
];

export interface ChamaInfo {
  name: string;
  creator: string;
  contributionAmount: bigint;
  maxMembers: bigint;
  currentRound: bigint;
  totalRounds: bigint;
  memberCount: bigint;
  state: number; // 0 = Forming, 1 = Active, 2 = Completed
}

export interface UserQuestStats {
  xp: bigint;
  streak: bigint;
  lastCheckIn: bigint;
  totalClaimed: bigint;
}

export interface NextQuestReward {
  chamaAmount: bigint;
  dayInCycle: bigint;
}

export class ChamaSDK {
  public provider: ethers.Provider | ethers.Signer;
  public vaultContract: ethers.Contract;
  public minerContract: ethers.Contract;
  public questsContract?: ethers.Contract;
  public tokenSaleContract?: ethers.Contract;
  public tokenContract?: ethers.Contract;

  constructor(
    providerOrSigner: ethers.Provider | ethers.Signer,
    vaultAddress: string,
    minerAddress: string,
    questsAddress?: string,
    tokenSaleAddress?: string,
    tokenAddress?: string
  ) {
    this.provider = providerOrSigner;
    this.vaultContract = new ethers.Contract(vaultAddress, ChamaVaultABI, providerOrSigner);
    this.minerContract = new ethers.Contract(minerAddress, ChamaMinerABI, providerOrSigner);
    if (questsAddress) {
      this.questsContract = new ethers.Contract(questsAddress, ChamaQuestsABI, providerOrSigner);
    }
    if (tokenSaleAddress) {
      this.tokenSaleContract = new ethers.Contract(tokenSaleAddress, ChamaTokenSaleABI, providerOrSigner);
    }
    if (tokenAddress) {
      this.tokenContract = new ethers.Contract(tokenAddress, ERC20ABI, providerOrSigner);
    }
  }

  // Vault Methods
  async createChama(name: string, token: string, amount: bigint, frequency: number, maxMembers: number, overrides?: ethers.Overrides) {
    return this.vaultContract.createChama(name, token, amount, frequency, maxMembers, overrides || {});
  }

  async joinChama(chamaId: number, overrides?: ethers.Overrides) {
    return this.vaultContract.joinChama(chamaId, overrides || {});
  }

  async contribute(chamaId: number, overrides?: ethers.Overrides) {
    return this.vaultContract.contribute(chamaId, overrides || {});
  }

  async getChamaInfo(chamaId: number): Promise<any> {
    return this.vaultContract.getChamaInfo(chamaId);
  }

  async getChamaInfoMapped(chamaId: number): Promise<ChamaInfo> {
    const info = await this.vaultContract.getChamaInfo(chamaId);
    return {
      name: info[0],
      creator: info[1],
      contributionAmount: info[2],
      maxMembers: info[3],
      currentRound: info[4],
      totalRounds: info[5],
      memberCount: info[6],
      state: Number(info[7]),
    };
  }

  async getChamaMembers(chamaId: number): Promise<string[]> {
    return this.vaultContract.getChamaMembers(chamaId);
  }

  async hasContributed(chamaId: number, round: number, member: string): Promise<boolean> {
    return this.vaultContract.hasContributed(chamaId, round, member);
  }

  async getRoundRecipient(chamaId: number, round: number): Promise<string> {
    return this.vaultContract.getRoundRecipient(chamaId, round);
  }

  async getMemberReputation(chamaId: number, member: string): Promise<bigint> {
    return this.vaultContract.getMemberReputation(chamaId, member);
  }

  async getGlobalReputation(member: string): Promise<bigint> {
    return this.vaultContract.getGlobalReputation(member);
  }

  async getMemberChamas(member: string): Promise<bigint[]> {
    return this.vaultContract.getMemberChamas(member);
  }

  async chamaCount(): Promise<bigint> {
    return this.vaultContract.chamaCount();
  }

  // Miner Methods
  async deposit(amount: bigint, overrides?: ethers.Overrides) {
    return this.minerContract.deposit(amount, overrides || {});
  }

  async withdraw(amount: bigint, overrides?: ethers.Overrides) {
    return this.minerContract.withdraw(amount, overrides || {});
  }

  async harvest(overrides?: ethers.Overrides) {
    return this.minerContract.harvest(overrides || {});
  }

  async upgradeTier(tier: number, overrides?: ethers.Overrides) { // 0 = FREE, 1 = LITE, 2 = PRO
    return this.minerContract.upgradeTier(tier, overrides || {});
  }

  async pendingRewards(account: string): Promise<bigint> {
    return this.minerContract.pendingRewards(account);
  }

  async getMultiplier(account: string): Promise<bigint> {
    return this.minerContract.getMultiplier(account);
  }

  async balances(account: string): Promise<bigint> {
    return this.minerContract.balances(account);
  }

  async userTiers(account: string): Promise<number> {
    return Number(await this.minerContract.userTiers(account));
  }

  // Quests Methods
  async checkIn(overrides?: ethers.Overrides) {
    if (!this.questsContract) throw new Error("Quests contract address not configured");
    return this.questsContract.checkIn(overrides || {});
  }

  async getQuestStats(account: string): Promise<UserQuestStats> {
    if (!this.questsContract) throw new Error("Quests contract address not configured");
    const stats = await this.questsContract.stats(account);
    return {
      xp: stats[0],
      streak: stats[1],
      lastCheckIn: stats[2],
      totalClaimed: stats[3],
    };
  }

  async getNextQuestReward(account: string): Promise<NextQuestReward> {
    if (!this.questsContract) throw new Error("Quests contract address not configured");
    const reward = await this.questsContract.getNextReward(account);
    return {
      chamaAmount: reward[0],
      dayInCycle: reward[1],
    };
  }

  // Token Sale Methods
  async buyWithCUSD(cusdAmount: bigint, overrides?: ethers.Overrides) {
    if (!this.tokenSaleContract) throw new Error("Token Sale contract address not configured");
    return this.tokenSaleContract.buyWithCUSD(cusdAmount, overrides || {});
  }

  async buyWithCELO(celoValue: bigint, overrides?: ethers.Overrides) {
    if (!this.tokenSaleContract) throw new Error("Token Sale contract address not configured");
    return this.tokenSaleContract.buyWithCELO({
      value: celoValue,
      ...(overrides || {})
    });
  }

  async totalChamaSold(): Promise<bigint> {
    if (!this.tokenSaleContract) throw new Error("Token Sale contract address not configured");
    return this.tokenSaleContract.totalChamaSold();
  }

  // ERC20 Token Methods
  async approveToken(spender: string, amount: bigint, overrides?: ethers.Overrides) {
    if (!this.tokenContract) throw new Error("Token contract address not configured");
    return this.tokenContract.approve(spender, amount, overrides || {});
  }

  async getTokenBalance(account: string): Promise<bigint> {
    if (!this.tokenContract) throw new Error("Token contract address not configured");
    return this.tokenContract.balanceOf(account);
  }

  async mintToken(to: string, amount: bigint, overrides?: ethers.Overrides) {
    if (!this.tokenContract) throw new Error("Token contract address not configured");
    return this.tokenContract.mint(to, amount, overrides || {});
  }

  // Formatting Utilities
  public static formatEther(wei: bigint): string {
    return ethers.formatEther(wei);
  }

  public static parseEther(ether: string): bigint {
    return ethers.parseEther(ether);
  }
}
