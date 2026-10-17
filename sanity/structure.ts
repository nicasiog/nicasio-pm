import type { StructureResolver } from 'sanity/structure'

export const SINGLETON_TYPES = new Set(['siteSettings', 'homePage', 'projectsPage', 'aboutPage', 'contactPage'])

const singletons: { type: string; title: string }[] = [
  { type: 'siteSettings', title: 'Site settings' },
  { type: 'homePage', title: 'Home' },
  { type: 'projectsPage', title: 'Projects page' },
  { type: 'aboutPage', title: 'About' },
  { type: 'contactPage', title: 'Contact' },
]

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      ...singletons.map(({ type, title }) =>
        S.listItem()
          .title(title)
          .id(type)
          .child(S.document().schemaType(type).documentId(type).title(title)),
      ),
      S.divider(),
      S.documentTypeListItem('project').title('Projects'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('experience').title('Experience'),
      S.documentTypeListItem('education').title('Education'),
    ])
