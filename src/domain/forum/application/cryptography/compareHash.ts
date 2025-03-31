export abstract class CompareHash {
    abstract compare(plain: string, hash: string): Promise<boolean>
}