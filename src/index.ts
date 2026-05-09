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

export class ChamaSDK {
  public provider: ethers.Provider | ethers.Signer;
  public vaultContract: ethers.Contract;
  public minerContract: ethers.Contract;

  constructor(
    providerOrSigner: ethers.Provider | ethers.Signer,
    vaultAddress: string,
    minerAddress: string
  ) {
    this.provider = providerOrSigner;
    this.vaultContract = new ethers.Contract(vaultAddress, ChamaVaultABI, providerOrSigner);
    this.minerContract = new ethers.Contract(minerAddress, ChamaMinerABI, providerOrSigner);
  }

  // Vault Methods
  async createChama(name: string, token: string, amount: bigint, frequency: number, maxMembers: number) {
    return this.vaultContract.createChama(name, token, amount, frequency, maxMembers);
  }

  async joinChama(chamaId: number) {
    return this.vaultContract.joinChama(chamaId);
  }

  async contribute(chamaId: number) {
    return this.vaultContract.contribute(chamaId);
  }

  async getChamaInfo(chamaId: number) {
    return this.vaultContract.getChamaInfo(chamaId);
  }

  async getChamaMembers(chamaId: number) {
    return this.vaultContract.getChamaMembers(chamaId);
  }

  async hasContributed(chamaId: number, round: number, member: string) {
    return this.vaultContract.hasContributed(chamaId, round, member);
  }

  // Miner Methods
  async deposit(amount: bigint) {
    return this.minerContract.deposit(amount);
  }

  async withdraw(amount: bigint) {
    return this.minerContract.withdraw(amount);
  }

  async harvest() {
    return this.minerContract.harvest();
  }

  async upgradeTier(tier: number) { // 0 = FREE, 1 = LITE, 2 = PRO
    return this.minerContract.upgradeTier(tier);
  }

  async pendingRewards(account: string) {
    return this.minerContract.pendingRewards(account);
  }
}
